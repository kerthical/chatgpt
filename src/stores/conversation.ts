import type { Conversation } from '@/types/conversation.ts';
import type { PrimitiveAtom } from 'jotai';

import { messagesAtom } from '@/stores/message.ts';
import { atom } from 'jotai';

/**
 * List of conversations
 */
export const conversationsAtom = atom<PrimitiveAtom<Conversation>[]>([]);
export const selectedConversationIdAtom = atom<null | string>(null);
export const currentConversationAtom = atom<PrimitiveAtom<Conversation> | null>(get => {
  const selectedConversationId = get(selectedConversationIdAtom);
  if (!selectedConversationId) return null;
  const conversations = get(conversationsAtom);
  return conversations.find(conversation => get(conversation).id === selectedConversationId) ?? null;
});

export const newConversationAtom = atom(null, (_get, set) => {
  set(selectedConversationIdAtom, null);
  set(messagesAtom, []);
});

export const deleteConversationAtom = atom(null, (get, set, conversationId: string) => {
  const conversations = get(conversationsAtom);
  const conversationIndex = conversations.findIndex(conversation => get(conversation).id === conversationId);
  if (conversationIndex === -1) return;
  conversations.splice(conversationIndex, 1);
  set(conversationsAtom, conversations);
  if (get(selectedConversationIdAtom) === conversationId) {
    set(newConversationAtom);
  }
});
