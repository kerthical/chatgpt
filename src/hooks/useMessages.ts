import { Message } from '@/types/Message.ts';
import { useListState } from '@mantine/hooks';

export function useMessages() {
  const [messages, messageHandlers] = useListState<Message>();

  return {
    messages,
    messageHandlers,
  };
}
