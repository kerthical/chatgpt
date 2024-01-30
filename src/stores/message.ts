import type { Conversation } from '@/types/conversation.ts';
import type { AssistantMessage, Attachment, Message } from '@/types/message.ts';
import type { PrimitiveAtom } from 'jotai';

import { clientAtom } from '@/stores/client.ts';
import { conversationsAtom, selectedConversationIdAtom } from '@/stores/conversation.ts';
import { atom } from 'jotai';
import { focusAtom } from 'jotai-optics';

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
  const generatedContentAtom = focusAtom(generatedMessageAtom, optic => optic.prop('content'));
  const generatedToolCallAtom = focusAtom(generatedMessageAtom, optic => optic.prop('toolCall'));

  set(messagesAtom, prev => [...prev, generatedMessageAtom as PrimitiveAtom<Message>]);
  for await (const chunk of completion) {
    const delta = chunk.choices[0]?.delta;
    if (!delta) continue;

    const content = delta?.content;
    if (content) {
      set(generatedContentAtom, prev => prev + content);
    }

    const toolCall = delta?.tool_calls?.[0];
    if (toolCall) {
      if (get(generatedToolCallAtom)) {
        set(generatedToolCallAtom, {
          uuid: crypto.randomUUID(),
          name: toolCall.function?.name ?? '',
          arguments: toolCall.function?.arguments ?? '',
          output: null,
        });
      } else {
        set(generatedToolCallAtom, prev => ({
          uuid: crypto.randomUUID(),
          name: prev?.name ?? '',
          arguments: (prev?.arguments ?? '') + (toolCall.function?.arguments ?? ''),
          output: null,
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

  const titleResponse = await client.chat.completions.create({
    model: 'gpt-3.5-turbo-1106',
    max_tokens: 128,
    messages: [
      {
        role: 'user',
        content:
          'Based on the conversation below, please think of a title in the same language as the conversation that succinctly captures the content in about 3 to 5 words.\n\n' +
          get(messagesAtom)
            .map(m => {
              const msg = get(m);
              return msg.role + ': ' + msg.content;
            })
            .join('\n---\n'),
      },
    ],
    stream: true,
  });

  const newConversationId = crypto.randomUUID();
  const generatedConversationAtom = atom<Conversation>({
    id: newConversationId,
    title: '',
    modelId: 'gpt-4-turbo-preview',
    messages: get(messagesAtom).map(m => get(m)),
  });

  const generatedTitleAtom = focusAtom(generatedConversationAtom, optic => optic.prop('title'));

  set(conversationsAtom, prev => [...prev, generatedConversationAtom]);
  set(selectedConversationIdAtom, newConversationId);
  for await (const chunk of titleResponse) {
    const delta = chunk.choices[0]?.delta;
    if (!delta) continue;

    const content = delta?.content;
    if (content) {
      set(generatedTitleAtom, prev => prev + content);
    }

    const finishReason = chunk.choices[0]?.finish_reason;
    if (finishReason === 'stop') break;
    if (finishReason === 'length') break;
    if (finishReason === 'tool_calls') break;
    if (finishReason === 'content_filter') break;
    if (finishReason === 'function_call') break;
  }
});
