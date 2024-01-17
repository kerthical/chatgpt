import { useGeneratingTask } from '@/hooks/useGeneratingTask.ts';
import { useHistories } from '@/hooks/useHistories.ts';
import { useMessages } from '@/hooks/useMessages.ts';
import { useModel } from '@/hooks/useModel.ts';
import { History } from '@/types/History.ts';
import { AssistantMessage, Message, ToolMessage, UserMessage } from '@/types/Message.ts';
import { getPDFContent } from '@/utils/utils.ts';
import { randomId } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';
import { APIError, OpenAI } from 'openai';
import { BadRequestError } from 'openai/error';

export function useGenerate() {
  const { setGenerationTask, setGenerating, cancelGeneration, customMyself, customInstruction } = useGeneratingTask();
  const { setMessages, appendMessage, editMessage } = useMessages();
  const { selectedHistory, selectHistory, setHistories } = useHistories();
  const { model } = useModel();

  async function generate(messages: Message[]) {
    try {
      cancelGeneration();
      const openai = new OpenAI({
        apiKey: localStorage.getItem('apiKey')!,
        dangerouslyAllowBrowser: true,
      });

      const conversation = messages.slice();
      setMessages(messages);

      const completion = await openai.chat.completions.create({
        model: model!.id,
        stream: true,
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant. Messages from users are passed in the following format If necessary, use the appropriate functions to retrieve external data and respond appropriately. You are obligated to reply in the same language as the user.

Format when a file is provided:
"""
<FileList>
---
<Message>
"""

Format when no file is provided:

"""
<Message>
"""${customMyself ? "\n\nThe user's profile is as follows:\n" + customMyself : ''}${
              customInstruction
                ? '\n\nThe user wants you (the assistant) to return the following:\n' + customInstruction
                : ''
            }`,
          },
          ...messages.map(m => m.toOpenAIMessage()),
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'retrieve',
              description: 'Retrieve a file content',
              parameters: {
                type: 'object',
                properties: {
                  fileName: {
                    type: 'string',
                    description: 'File name to retrieve (any file supported including images)',
                  },
                },
                required: ['fileName'],
              },
            },
          },
        ],
      });

      setGenerating(true);
      setGenerationTask(completion);

      let isFirst = true;
      for await (const chunk of completion) {
        const delta = chunk.choices[0].delta.content;
        if (delta) {
          if (isFirst) {
            appendMessage(new AssistantMessage(chunk.id, delta, []));
            conversation.push(new AssistantMessage(chunk.id, delta, []));
            isFirst = false;
          } else {
            editMessage(chunk.id, prev => {
              (prev as AssistantMessage).appendContent(delta);
              return prev;
            });
            (conversation[conversation.length - 1] as AssistantMessage).appendContent(delta);
          }
        }

        const toolCalls = chunk.choices[0].delta.tool_calls;
        if (toolCalls) {
          for (const toolCall of toolCalls) {
            if (isFirst) {
              appendMessage(
                new AssistantMessage(chunk.id, '', [
                  {
                    id: toolCall.id!,
                    name: toolCall.function!.name!,
                    arguments: toolCall.function?.arguments ?? '',
                  },
                ]),
              );
              conversation.push(
                new AssistantMessage(chunk.id, '', [
                  {
                    id: toolCall.id!,
                    name: toolCall.function!.name!,
                    arguments: toolCall.function?.arguments ?? '',
                  },
                ]),
              );
              isFirst = false;
            } else {
              editMessage(chunk.id, prev => {
                (prev as AssistantMessage).appendToolCall(
                  toolCall.id,
                  toolCall.function?.name,
                  toolCall.function?.arguments,
                );
                return prev;
              });
              (conversation[conversation.length - 1] as AssistantMessage).appendToolCall(
                toolCall.id,
                toolCall.function?.name,
                toolCall.function?.arguments,
              );
            }
          }
        }

        if (chunk.choices[0].finish_reason === 'stop') break;
        if (chunk.choices[0].finish_reason === 'length') {
          await generate(conversation);
          break;
        }

        if (chunk.choices[0].finish_reason === 'tool_calls') {
          for (const toolCall of (conversation[conversation.length - 1] as AssistantMessage).tool_calls) {
            switch (toolCall.name) {
              case 'retrieve': {
                const fileName = JSON.parse(toolCall.arguments!)['fileName'];
                const fileBase64 = (
                  conversation.find(m => {
                    if (m instanceof UserMessage) {
                      return m.attachments.some(f => f.name === fileName);
                    } else {
                      return false;
                    }
                  }) as UserMessage
                )?.attachments.find(f => f.name === fileName)?.url;

                let fileContent: string;
                if (fileBase64?.startsWith('data:image/')) {
                  const response = await openai.chat.completions.create({
                    model: 'gpt-4-vision-preview',
                    max_tokens: 4096,
                    messages: [
                      {
                        role: 'user',
                        content: [
                          {
                            type: 'text',
                            text:
                              'Describe the given image in as much detail as possible. The context is as follows:\n\n' +
                              conversation.map(m => m.role + ': ' + m.content).join('\n---\n'),
                          },
                          {
                            type: 'image_url',
                            image_url: {
                              url: fileBase64,
                              detail: 'high',
                            },
                          },
                        ],
                      },
                    ],
                  });
                  fileContent = response.choices[0].message.content ?? '<LOAD_ERROR>';
                } else if (fileBase64?.startsWith('data:application/pdf')) {
                  fileContent = await getPDFContent(fileBase64);
                } else {
                  fileContent = fileBase64
                    ? atob(fileBase64.split(',')[1])
                        .split('\n')
                        .map(line => line.replace(/\r/g, ''))
                        .join('\n')
                    : '<LOAD_ERROR>';
                }

                appendMessage(new ToolMessage(toolCall.id, 'retrieve', `${fileName}:\n ${fileContent}`));
                conversation.push(new ToolMessage(toolCall.id, 'retrieve', `${fileName}:\n ${fileContent}`));
                break;
              }
            }
          }
          await generate(conversation);
          return;
        }
      }

      setGenerating(false);
      setGenerationTask(null);

      if (!selectedHistory) {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo-1106',
          max_tokens: 128,
          messages: [
            {
              role: 'user',
              content:
                'Based on the conversation below, please think of a title in the same language as the conversation that succinctly captures the content in about 3 to 5 words.\n\n' +
                conversation.map(m => m.role + ': ' + m.content).join('\n---\n'),
            },
          ],
          stream: true,
        });

        let historyId: string | null = null;
        for await (const chunk of response) {
          const delta = chunk.choices[0].delta.content;
          if (delta) {
            if (historyId === null) {
              historyId = randomId();
              setHistories(prev => [...prev, new History(historyId!, delta, model!.id, conversation)]);
            } else {
              setHistories(prev =>
                prev.map(h => {
                  if (h.id === historyId) {
                    return new History(h.id, h.name + delta, h.model, conversation);
                  } else {
                    return h;
                  }
                }),
              );
            }
          }
        }

        selectHistory(historyId!);
      } else {
        setHistories(prev =>
          prev.map(h => {
            if (h.id === selectedHistory?.id) {
              return new History(h.id, h.name, h.model, conversation);
            } else {
              return h;
            }
          }),
        );
      }
    } catch (e) {
      let errorMessage: string;
      if (e instanceof BadRequestError && e.message.includes("400 This model's maximum context")) {
        if (model?.name === 'GPT-3.5') {
          errorMessage =
            'メッセージの長さが長すぎる可能性があります。モデルをGPT-4に変更するか、メッセージを短くしてください。';
        } else {
          errorMessage = 'メッセージの長さが長すぎる可能性があります。メッセージを短くしてください。';
        }
      } else if (e instanceof APIError) {
        errorMessage = 'APIの呼び出しに失敗しました。エラーの詳細はコンソールに記録されました。';
        console.error(e);
      } else {
        errorMessage = '不明なエラーが発生しました。エラーの詳細はコンソールに記録されました。';
        console.error(e);
      }

      notifications.show({
        color: 'red',
        title: 'エラー',
        message: errorMessage,
        icon: <IconCircleX size={24} />,
      });
    } finally {
      setGenerating(false);
      setGenerationTask(null);
    }
  }

  return {
    generate,
  };
}
