import { Message } from '@/types/Message.ts';
import { atom, useAtom } from 'jotai';

const messagesAtom = atom<Message[]>([]);
export function useMessages() {
  const [messages, setMessages] = useAtom(messagesAtom);

  function appendMessage(message: Message) {
    setMessages(prev => [...prev, message]);
  }

  function editMessage(id: string, message: Message | ((message: Message) => Message)) {
    setMessages(messages =>
      messages.map(m => {
        if (m.id === id) {
          if (typeof message === 'function') {
            return message(m);
          } else {
            return message;
          }
        } else {
          return m;
        }
      }),
    );
  }

  return {
    messages,
    setMessages,
    appendMessage,
    editMessage,
  };
}
