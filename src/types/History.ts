import { Message } from '@/types/Message.ts';

export type History = {
  id: string;
  name: string;
  model: string;
  messages: Message[];
};
