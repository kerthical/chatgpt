import * as classes from '@/pages/App/Navbar/History/History.css.ts';
import { useHistories } from '@/hooks/useHistories.ts';
import { History as HistoryType } from '@/types/History.ts';
import { ActionIcon, Box, Group, Menu, Text, TextInput } from '@mantine/core';
import { IconArchive, IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

export default function History(props: { history: HistoryType }) {
  const { history } = props;
  const { histories, selectedHistory, selectHistory, historyHandlers, newHistory } = useHistories();
  const editInputRef = useRef<HTMLInputElement>(null);
  const [historyName, setHistoryName] = useState(history.name);
  const [isEditing, setIsEditing] = useState(false);
  const isSelected = selectedHistory?.id === history.id;

  useEffect(() => {
    setHistoryName(history.name);
    setIsEditing(false);
  }, [selectedHistory]);

  function onDelete() {
    const newState = histories.slice().filter(h => h.id !== history.id);
    historyHandlers.setState(newState);
    if (history.id === selectedHistory?.id) {
      newHistory();
    }
  }

  return (
    <Box
      className={isSelected && !isEditing ? classes.historySelected : classes.historyUnselected}
      component="a"
      h={36}
      p={isEditing ? 0 : 6}
      onClick={() => selectHistory(history.id)}
    >
      {isEditing ? (
        <TextInput
          ref={editInputRef}
          placeholder="チャットの名前を入力"
          size="xs"
          value={historyName}
          variant="filled"
          w="100%"
          onChange={event => {
            setHistoryName(event.currentTarget.value);
          }}
          onKeyDown={event => {
            if (event.keyCode === 13) {
              const newState = histories.slice();
              newState.find(h => h.id === history.id)!.name = historyName;
              historyHandlers.setState(newState);
              setIsEditing(false);
            } else if (event.key === 'Escape') {
              setHistoryName(history.name);
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <>
          <Group align="center" gap={4} w="100%">
            <Box className="relative h-full w-full grow overflow-hidden whitespace-nowrap">
              <Text c="white" className="h-full w-full" size="sm" ta="left">
                {history.name}
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
            <Menu position="bottom-start" width={200}>
              <Menu.Target>
                <ActionIcon c="gray" size={20} variant="transparent" onClick={e => e.stopPropagation()}>
                  <IconDots />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown className={classes.historyMenu}>
                <Menu.Item
                  className={classes.historyMenuItem}
                  leftSection={<IconEdit size={18} />}
                  onClick={() => {
                    setIsEditing(true);
                    setTimeout(() => {
                      editInputRef.current?.focus();
                    }, 0);
                  }}
                >
                  チャットの名前を変更
                </Menu.Item>
                <Menu.Item
                  c="red"
                  className={classes.historyMenuItem}
                  leftSection={<IconTrash size={18} />}
                  onClick={onDelete}
                >
                  チャットを削除
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <ActionIcon
              c="gray"
              size={20}
              variant="transparent"
              onClick={e => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <IconArchive />
            </ActionIcon>
          </Group>
        </>
      )}
    </Box>
  );
}
