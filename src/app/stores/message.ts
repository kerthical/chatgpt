import type { AssistantMessage, Attachment, Message } from '@/types';
import type { PrimitiveAtom } from 'jotai';

import { clientAtom } from '@/app/stores';
import { atom } from 'jotai';

/**
 * List of messages for the current session
 */
export const messagesAtom = atom<PrimitiveAtom<Message>[]>([]);

/**
 * Assistant generating task to cancellable; null indicates that there is no task, and true indicates that it is waiting for a response
 */
export const generatingTaskAtom = atom<AbortController | null | true>(null);

/**
 * The atom to which the user sends a message
 */
export const sendMessageAtom = atom(null, async (get, set, content: string, attachments: Attachment[]) => {
  const exisingTask = get(generatingTaskAtom);
  if (exisingTask !== null) {
    if (exisingTask === true) return;
    else exisingTask.abort();
  }

  set(messagesAtom, prev => [
    ...prev,
    atom<Message>({
      role: 'user',
      uuid: crypto.randomUUID(),
      content,
      attachments,
    }),
  ]);
  set(generatingTaskAtom, true);
  const client = get(clientAtom);
  const completion = await client.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    stream: true,
    messages: [],
  });
  set(generatingTaskAtom, completion.controller);

  const generatedMessageAtom = atom<AssistantMessage>({
    role: 'assistant',
    uuid: crypto.randomUUID(),
    content: '',
    toolCall: null,
  });

  set(messagesAtom, prev => [...prev, generatedMessageAtom as PrimitiveAtom<Message>]);
  for await (const chunk of completion) {
    const delta = chunk.choices[0]?.delta;
    if (!delta) continue;

    const content = delta?.content;
    if (content) {
      set(generatedMessageAtom, prev => ({
        ...prev,
        content: prev.content + content,
      }));
    }

    const toolCall = delta?.tool_calls?.[0];
    if (toolCall) {
      if (get(generatedMessageAtom).toolCall === null) {
        set(generatedMessageAtom, prev => ({
          ...prev,
          toolCall: {
            uuid: crypto.randomUUID(),
            name: toolCall.function?.name ?? '',
            arguments: toolCall.function?.arguments ?? '',
            output: null,
          },
        }));
      } else {
        set(generatedMessageAtom, prev => ({
          ...prev,
          toolCall: {
            ...prev.toolCall!,
            arguments: prev.toolCall!.arguments + (toolCall.function?.arguments ?? ''),
          },
        }));
      }
    }

    const finishReason = chunk.choices[0]?.finish_reason;
    if (finishReason === 'stop') break;
    if (finishReason === 'length') break;
    if (finishReason === 'tool_calls') break;
    if (finishReason === 'content_filter') break;
    if (finishReason === 'function_call') break;
  }
});
