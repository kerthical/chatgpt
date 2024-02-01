import type { Conversation } from '@/types/conversation.ts';
import type { PrimitiveAtom } from 'jotai';

import { messagesAtom } from '@/stores/message.ts';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { atomEffect } from 'jotai-effect';

const getFromLocalStorage = () => {
  try {
    const conversations = JSON.parse(localStorage.getItem('conversations') ?? '[]') as Conversation[];
    return conversations.map(conversation => atom(conversation));
  } catch (e) {
    return [];
  }
};

const baseConversationsAtom = atom<PrimitiveAtom<Conversation>[]>(getFromLocalStorage());

export const conversationsAtom = atom(
  get => get(baseConversationsAtom),
  (
    get,
    set,
    conversations:
      | ((conversations: PrimitiveAtom<Conversation>[]) => PrimitiveAtom<Conversation>[])
      | PrimitiveAtom<Conversation>[],
  ) => {
    const nextValue = typeof conversations === 'function' ? conversations(get(baseConversationsAtom)) : conversations;
    set(baseConversationsAtom, nextValue);
    localStorage.setItem('conversations', JSON.stringify(nextValue.map(conversation => get(conversation))));
  },
);

export const selectedConversationIdAtom = atomWithStorage<null | string>('selectedConversation', null);

export const onSelectedConversationChangeAtom = atomEffect((get, set) => {
  const conversations = get(conversationsAtom);
  const selectedConversationId = get(selectedConversationIdAtom);
  const conversation = conversations.find(conversation => get(conversation).id === selectedConversationId);
  if (conversation) {
    set(
      messagesAtom,
      get(conversation).messages.map(m => atom(m)),
    );
  } else {
    set(messagesAtom, []);
  }
});

export const newConversationAtom = atom(null, (_get, set) => {
  set(selectedConversationIdAtom, null);
});

export const saveConversationAtom = atom(null, get => {
  const conversations = get(conversationsAtom);
  localStorage.setItem('conversations', JSON.stringify(conversations.map(conversation => get(conversation))));
});

export const deleteConversationAtom = atom(null, (get, set, conversationId: string) => {
  const conversations = get(conversationsAtom);
  set(
    conversationsAtom,
    conversations.filter(conversation => get(conversation).id !== conversationId),
  );
  set(saveConversationAtom);
  if (get(selectedConversationIdAtom) === conversationId) {
    set(newConversationAtom);
  }
});
