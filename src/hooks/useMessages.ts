import { Message } from '@/types/Message.ts';
import { atom, useAtom } from 'jotai';

const messagesAtom = atom<Message[]>([]);
export function useMessages() {
  const [messages, setMessages] = useAtom(messagesAtom);

  return {
    messages,
    setMessages,
  };
}
