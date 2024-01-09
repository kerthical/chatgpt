import { useHistories } from '@/hooks/useHistories.ts';
import { useMessages } from '@/hooks/useMessages.ts';
import { useModel } from '@/hooks/useModel.ts';
import { Message, toOpenAIMessage } from '@/types/Message.ts';
import { notifications } from '@mantine/notifications';
import { OpenAI } from 'openai';
import { Stream } from 'openai/streaming';
import { useState } from 'react';

import ChatCompletionChunk = OpenAI.Chat.ChatCompletionChunk;

export function useGenerate() {
  const [isGenerating, setGenerating] = useState(false);
  const [generationTask, setGenerationTask] = useState<Stream<ChatCompletionChunk> | null>(null);
  const { selectedHistory, historyHandlers, selectHistory } = useHistories();
  const { messageHandlers } = useMessages();
  const { model } = useModel();

  async function generate(messages: Message[]) {
    try {
      setGenerating(true);
      const openai = new OpenAI({
        apiKey: localStorage.getItem('apiKey')!,
        dangerouslyAllowBrowser: true,
      });

      messageHandlers.setState(messages);

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
            messageHandlers.append({
              id,
              role: 'assistant',
              content: delta,
            });
          } else {
            messageHandlers.applyWhere(
              item => item.id === id,
              item => ({
                ...item,
                content: item.content + delta,
              }),
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
          model,
          messages: conversation,
        });
        selectHistory(id);
      }

      historyHandlers.setState(savedHistory);
      localStorage.setItem('history', JSON.stringify(savedHistory));
    } catch (e) {
      notifications.show({
        title: 'An error occurred while generating the message.',
        message: 'Error details have been logged to the console.',
      });
      console.error(e);
    } finally {
      setGenerating(false);
      setGenerationTask(null);
    }
  }

  return {
    generate,
    isGenerating: isGenerating,
    cancelGeneration: () => {
      generationTask?.controller.abort();
      setGenerating(false);
      setGenerationTask(null);
    },
  };
}
