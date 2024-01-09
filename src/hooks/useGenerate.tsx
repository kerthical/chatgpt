import { useMessages } from '@/hooks/useMessages.ts';
import { useModel } from '@/hooks/useModel.ts';
import { History } from '@/types/History.ts';
import { Message, toOpenAIMessage } from '@/types/Message.ts';
import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';
import { atom, useAtom } from 'jotai';
import { OpenAI } from 'openai';
import { Stream } from 'openai/streaming';

import ChatCompletionChunk = OpenAI.Chat.ChatCompletionChunk;

const isGeneratingAtom = atom(false);
const generationTaskAtom = atom<Stream<ChatCompletionChunk> | null>(null);

export function useGenerate(
  selectedHistory: History | null | undefined,
  selectHistory: (id: string) => void,
  setHistories: (histories: History[]) => void,
) {
  const [isGenerating, setGenerating] = useAtom(isGeneratingAtom);
  const [generationTask, setGenerationTask] = useAtom(generationTaskAtom);
  const { setMessages } = useMessages();
  const { model } = useModel();

  function cancelGeneration() {
    generationTask?.controller.abort();
    setGenerating(false);
    setGenerationTask(null);
  }

  async function generate(messages: Message[]) {
    try {
      cancelGeneration();
      setGenerating(true);
      const openai = new OpenAI({
        apiKey: localStorage.getItem('apiKey')!,
        dangerouslyAllowBrowser: true,
      });

      setMessages(messages);

      const completion = await openai.chat.completions.create({
        model: model!.id,
        max_tokens: 4096,
        stream: true,
        messages: messages.map(toOpenAIMessage),
      });

      setGenerationTask(completion);

      let index = 0;
      let content = '';
      let assistantId = '';
      for await (const chunk of completion) {
        const id = chunk.id;
        const delta = chunk.choices[0].delta.content;
        if (delta) {
          if (index === 0) {
            setMessages(prev => [
              ...prev,
              {
                id,
                role: 'assistant',
                content: delta,
              },
            ]);
          } else {
            setMessages(prev =>
              prev.map(item =>
                item.id === id
                  ? {
                      ...item,
                      content: item.content + delta,
                    }
                  : item,
              ),
            );
          }
          index++;
          content += delta;
          assistantId = id;
        }
      }

      setGenerating(false);
      setGenerationTask(null);

      const conversation = [
        ...messages,
        {
          id: assistantId,
          role: 'assistant',
          content: content,
        },
      ];
      const savedHistory = JSON.parse(localStorage.getItem('history') || '[]');
      if (selectedHistory) {
        savedHistory.find((h: { id: string }) => h.id === selectedHistory.id)!.messages = conversation;
      } else {
        const summarizeCompletion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo-1106',
          messages: [
            {
              role: 'user',
              content:
                'Create an appropriate head title of 3~5 words that summarizes this conversation. The response should only include the title content, no other information.\n\n' +
                conversation.map(m => `${m.role}:\n${m.content}\n`).join('\n---\n'),
            },
          ],
        });
        const id = Math.random().toString(36).substring(2, 9);
        savedHistory.push({
          id,
          name: summarizeCompletion.choices[0].message.content,
          model: model?.id,
          messages: conversation,
        });
        selectHistory(id);
      }

      setHistories(savedHistory);
    } catch (e) {
      notifications.show({
        color: 'red',
        title: 'エラー',
        message: 'メッセージの生成中にエラーが発生しました。エラーの詳細はコンソールに記録されました。',
        icon: <IconCircleX size={24} />,
      });
      console.error(e);
    } finally {
      setGenerating(false);
      setGenerationTask(null);
    }
  }

  return {
    generate,
    cancelGeneration,
    isGenerating: isGenerating,
  };
}
