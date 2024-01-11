import { randomId } from '@mantine/hooks';
import OpenAI from 'openai';

import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;

  toOpenAIMessage(): ChatCompletionMessageParam;
}

export function fromJSONtoMessage(message: unknown): Message | null {
  if (!message) return null;
  if (typeof message !== 'object') return null;
  if (!('id' in message)) return null;
  if (!('role' in message)) return null;
  if (!('content' in message)) return null;
  if (typeof message['id'] !== 'string') return null;
  if (typeof message['role'] !== 'string') return null;
  if (typeof message['content'] !== 'string') return null;

  switch (message['role']) {
    case 'user':
      if (!('files' in message)) return null;
      if (!Array.isArray(message['files'])) return null;
      return new UserMessage(message['id'], message['content'], message['files']);
    case 'assistant':
      return new AssistantMessage(message['id'], message['content']);
    case 'tool':
      return new ToolMessage(message['id'], message['content']);
    default:
      return null;
  }
}

export function fromMessageToJSON(message: Message) {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    ...(message.role === 'user'
      ? {
          files: (message as UserMessage).files,
        }
      : {}),
  };
}

export class UserMessage implements Message {
  role: 'user';

  constructor(
    public id: string = randomId(),
    public content: string,
    public files: {
      name: string;
      url: string;
    }[] = [],
  ) {
    this.role = 'user';
  }

  toOpenAIMessage(): ChatCompletionMessageParam {
    return {
      role: 'user',
      content: [
        {
          type: 'text',
          text: this.content,
        },
        ...this.files.map(f => {
          return {
            type: 'image_url' as const,
            image_url: {
              url: f.url,
              detail: 'high' as const,
            },
          };
        }),
      ],
    };
  }
}

export class AssistantMessage implements Message {
  id: string;
  role: 'assistant';
  content: string;
  tool_calls: {
    id: string;
    name: string;
    arguments: string;
  }[];

  constructor(id: string, content: string) {
    this.id = id;
    this.role = 'assistant';
    this.content = content;
    this.tool_calls = [];
  }

  appendContent(content: string) {
    this.content += content;
  }

  appendToolCall(id: string, name: string, args: string) {
    this.tool_calls.push({
      id,
      name,
      arguments: args,
    });
  }

  toOpenAIMessage(): ChatCompletionMessageParam {
    return {
      role: 'assistant',
      content: this.content,
    };
  }
}

export class ToolMessage implements Message {
  id: string;
  role: 'tool';
  content: string;

  constructor(id: string, content: string) {
    this.id = id;
    this.role = 'tool';
    this.content = content;
  }

  toOpenAIMessage(): ChatCompletionMessageParam {
    return {
      role: 'tool',
      tool_call_id: this.id,
      content: this.content,
    };
  }
}
