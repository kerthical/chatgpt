import type { Conversation as ConversationType } from '@/types/conversation.ts';
import type { PrimitiveAtom } from 'jotai';

import { useTranslator } from '@/hooks/useTranslator.ts';
import { deleteConversationAtom, saveConversationAtom, selectedConversationIdAtom } from '@/stores/conversation.ts';
import { ActionIcon, Box, Group, Menu, Text, TextInput, Tooltip } from '@mantine/core';
import { IconArchive, IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { useSetAtom } from 'jotai/index';
import { memo, useEffect, useRef, useState } from 'react';

import * as classes from './Conversation.css.ts';

interface ConversationProps {
  conversation: PrimitiveAtom<ConversationType>;
}

export const Conversation = memo<ConversationProps>((props: ConversationProps) => {
  const [conversation, setConversation] = useAtom(props.conversation);
  const [selectedConversation, setSelectedConversation] = useAtom(selectedConversationIdAtom);
  const deleteConversation = useSetAtom(deleteConversationAtom);
  const saveConversation = useSetAtom(saveConversationAtom);
  const [conversationTitle, setConversationTitle] = useState(conversation.title);
  const [isEditing, setEditing] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const isSelected = selectedConversation === conversation.id;
  const translate = useTranslator('navbar');

  useEffect(() => {
    setConversationTitle(conversation.title);
  }, [conversationTitle]);

  return (
    <Box
      className={isSelected && !isEditing ? classes.historySelected : classes.historyUnselected}
      component="a"
      h={36}
      onClick={() => setSelectedConversation(conversation.id)}
      p={isEditing ? 0 : 6}
    >
      {isEditing ? (
        <TextInput
          onChange={event => {
            setConversationTitle(event.currentTarget.value);
          }}
          onKeyDown={event => {
            if (event.keyCode === 13) {
              setConversation(prev => ({ ...prev, title: conversationTitle }));
              saveConversation();
              setEditing(false);
            } else if (event.key === 'Escape') {
              setConversationTitle(conversation.title);
              setEditing(false);
            }
          }}
          placeholder={translate('enter_chat_name_placeholder')}
          ref={editInputRef}
          size="xs"
          value={conversationTitle}
          variant="filled"
          w="100%"
        />
      ) : (
        <>
          <Group gap={4} w="100%">
            <Box flex={1} h="100%" pos="relative" style={{ overflow: 'hidden', whiteSpace: 'nowrap' }} w="100%">
              <Text c="white" h="100%" size="sm" ta="left" w="100%">
                {conversation.title}
              </Text>
              <div className={isSelected ? classes.historyOverlaySelected : classes.historyOverlayUnselected} />
            </Box>
          </Group>
          <Group
            bottom={0}
            className={isSelected ? classes.historyActionsSelected : classes.historyActionsUnselected}
            gap={3}
            mr="xs"
            pos="absolute"
            right={0}
            top={0}
          >
            <Menu position="bottom-start" width={220}>
              <Menu.Target>
                <ActionIcon c="gray" onClick={e => e.stopPropagation()} size={20} variant="transparent">
                  <IconDots />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown className={classes.historyMenu}>
                <Menu.Item
                  className={classes.historyMenuItem}
                  leftSection={<IconEdit size={18} />}
                  onClick={() => {
                    setEditing(true);
                    setTimeout(() => {
                      editInputRef.current?.focus();
                    }, 0);
                  }}
                >
                  {translate('change_chat_name')}
                </Menu.Item>
                <Menu.Item
                  c="red"
                  className={classes.historyMenuItem}
                  leftSection={<IconTrash size={18} />}
                  onClick={() => deleteConversation(conversation.id)}
                >
                  {translate('delete_chat')}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Tooltip bg="black" c="white" fw={700} label={translate('delete_chat')} position="right" withArrow>
              <ActionIcon
                c="gray"
                onClick={e => {
                  deleteConversation(conversation.id);
                  e.stopPropagation();
                }}
                size={20}
                variant="transparent"
              >
                <IconArchive />
              </ActionIcon>
            </Tooltip>
          </Group>
        </>
      )}
    </Box>
  );
});

Conversation.displayName = 'History';
