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
      if (!('files' in message)) return null;
      if (!Array.isArray(message['files'])) return null;
      return new UserMessage(message['id'], message['content'], message['files']);
    case 'assistant':
      if (!('tool_calls' in message)) return null;
      if (!Array.isArray(message['tool_calls'])) return null;
      return new AssistantMessage(message['id'], message['content'], message['tool_calls']);
    case 'tool':
      return new ToolMessage(message['id'], message['content']);
    default:
      return null;
  }
}

export class UserMessage implements Message {
  role: 'user';

  constructor(
    public id: string,
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
          text: (this.files.length ? this.files.map(f => `- ${f.name}`).join('\n') + '\n---\n' : '') + this.content,
        },
      ],
    };
  }

  toJSON(): unknown {
    return {
      id: this.id,
      role: this.role,
      content: this.content,
      files: this.files,
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

  constructor(id: string, content: string, tool_calls: { id: string; name: string; arguments: string }[]) {
    this.id = id;
    this.role = 'assistant';
    this.content = content;
    this.tool_calls = tool_calls;
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
      tool_calls: this.tool_calls.map(tc => ({
        id: tc.id,
        type: 'function',
        function: {
          name: tc.name,
          arguments: tc.arguments,
        },
      })),
    };
  }

  toJSON(): unknown {
    return {
      id: this.id,
      role: this.role,
      content: this.content,
      tool_calls: this.tool_calls,
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

  toJSON(): unknown {
    return {
      id: this.id,
      role: this.role,
      content: this.content,
    };
  }
}
