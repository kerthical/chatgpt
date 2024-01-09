import OpenAI from 'openai';

import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

export type Message = ChatCompletionMessageParam & {
  id: string;
};

export function toOpenAIMessage(message: Message): ChatCompletionMessageParam {
  return {
    role: message.role as 'user' | 'assistant',
    content: message.content,
  } as ChatCompletionMessageParam;
}
