import { OpenAI } from 'openai';
import { ReactNode } from 'react';

import ChatCompletionCreateParams = OpenAI.Chat.ChatCompletionCreateParams;

export type Model = {
  id: Pick<ChatCompletionCreateParams, 'model'>['model'];
  name: string;
  version: string;
  description: string;
  icon: ReactNode;
};
