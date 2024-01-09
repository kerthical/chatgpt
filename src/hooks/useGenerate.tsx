import { useGeneratingTask } from '@/hooks/useGeneratingTask.ts';
import { useHistories } from '@/hooks/useHistories.ts';
import { useMessages } from '@/hooks/useMessages.ts';
import { useModel } from '@/hooks/useModel.ts';
import { Message, toOpenAIMessage } from '@/types/Message.ts';
import { randomId } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';
import { OpenAI } from 'openai';

export function useGenerate() {
  const { selectedHistory, setHistories, selectHistory } = useHistories();
  const { setGenerationTask, setGenerating, cancelGeneration } = useGeneratingTask();
  const { setMessages } = useMessages();
  const { model } = useModel();

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
        const id = randomId();
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
  };
}
