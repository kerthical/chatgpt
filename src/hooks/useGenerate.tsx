import { useGeneratingTask } from '@/hooks/useGeneratingTask.ts';
import { useHistories } from '@/hooks/useHistories.ts';
import { useMessages } from '@/hooks/useMessages.ts';
import { useModel } from '@/hooks/useModel.ts';
import { History } from '@/types/History.ts';
import { AssistantMessage, Message } from '@/types/Message.ts';
import { randomId } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';
import { OpenAI } from 'openai';

export function useGenerate() {
  const { setGenerationTask, setGenerating, cancelGeneration } = useGeneratingTask();
  const { setMessages, appendMessage, editMessage } = useMessages();
  const { setHistories } = useHistories();
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
        max_tokens: 4096,
        stream: true,
        messages: messages.map(m => m.toOpenAIMessage()),
      });

      setGenerating(true);
      setGenerationTask(completion);

      let index = 0;
      for await (const chunk of completion) {
        const delta = chunk.choices[0].delta.content;
        if (delta) {
          if (index === 0) {
            appendMessage(new AssistantMessage(chunk.id, delta));
            conversation.push(new AssistantMessage(chunk.id, delta));
          } else {
            editMessage(chunk.id, prev => {
              (prev as AssistantMessage).appendContent(delta);
              return prev;
            });
            (conversation[conversation.length - 1] as AssistantMessage).appendContent(delta);
          }
          index++;
        }
      }

      setGenerating(false);
      setGenerationTask(null);

      setHistories(prev => [...prev, new History(randomId(), 'New Chat', model!.id, conversation)]);
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
