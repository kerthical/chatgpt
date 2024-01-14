import OpenAI from 'openai';

import ChatCompletionMessageParam = OpenAI.ChatCompletionMessageParam;

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;

  toOpenAIMessage(): ChatCompletionMessageParam;

  toJSON(): unknown;
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
      if (!('attachments' in message)) return null;
      if (!Array.isArray(message['attachments'])) return null;
      return new UserMessage(message['id'], message['content'], message['attachments']);
    case 'assistant':
      if (!('tool_calls' in message)) return null;
      if (!Array.isArray(message['tool_calls'])) return null;
      return new AssistantMessage(message['id'], message['content'], message['tool_calls']);
    case 'tool':
      if (!('func' in message)) return null;
      if (typeof message['func'] !== 'string') return null;
      return new ToolMessage(message['id'], message['func'], message['content']);
    default:
      return null;
  }
}

export type Attachment = {
  name: string;
  url: string;
};

export class UserMessage implements Message {
  role: 'user';

  constructor(
    public id: string,
    public content: string,
    public attachments: Attachment[],
  ) {
    this.role = 'user';
  }

  toOpenAIMessage(): ChatCompletionMessageParam {
    return {
      role: 'user',
      content: [
        {
          type: 'text',
          text:
            (this.attachments.length > 0 ? this.attachments.map(f => `- ${f.name}`).join('\n') + '\n---\n' : '') +
            this.content,
        },
      ],
    };
  }

  toJSON(): unknown {
    return {
      role: this.role,
      id: this.id,
      content: this.content,
      attachments: this.attachments,
    };
  }
}

export type ToolCall = {
  id: string;
  name: string;
  arguments: string;
};

export class AssistantMessage implements Message {
  role: 'assistant';

  constructor(
    public id: string,
    public content: string,
    public tool_calls: ToolCall[],
  ) {
    this.role = 'assistant';
  }

  appendContent(content: string) {
    this.content += content;
  }

  appendToolCall(id: string | undefined, name: string | undefined, args: string | undefined) {
    if (this.tool_calls.find(tc => tc.id === id) || id === undefined) {
      this.tool_calls = this.tool_calls.map((tc, i) => {
        if (tc.id === id || (i === 0 && id === undefined)) {
          return {
            id: id || tc.id,
            name: name || tc.name,
            arguments: args ? tc.arguments + args : tc.arguments,
          };
        } else {
          return tc;
        }
      });
    } else {
      this.tool_calls.push({
        id: id,
        name: name || '',
        arguments: args || '',
      });
    }
  }

  toOpenAIMessage(): ChatCompletionMessageParam {
    return {
      role: 'assistant',
      content: this.content,
      ...(this.tool_calls.length > 0
        ? {
            tool_calls: this.tool_calls.map(tc => ({
              id: tc.id,
              type: 'function',
              function: {
                name: tc.name,
                arguments: tc.arguments,
              },
            })),
          }
        : {}),
    };
  }

  toJSON(): unknown {
    return {
      role: this.role,
      id: this.id,
      content: this.content,
      tool_calls: this.tool_calls,
    };
  }
}

export class ToolMessage implements Message {
  role: 'tool';

  constructor(
    public id: string,
    public func: string,
    public content: string,
  ) {
    this.role = 'tool';
  }

  toOpenAIMessage(): ChatCompletionMessageParam {
    return {
      role: 'tool',
      tool_call_id: this.id,
      content: this.content,
    };
  }

  toJSON(): unknown {
    return {
      role: this.role,
      id: this.id,
      func: this.func,
      content: this.content,
    };
  }
}
