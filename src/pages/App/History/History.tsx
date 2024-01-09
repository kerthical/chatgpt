import * as classes from '@/pages/App/History/History.css.ts';
import { ActionIcon, Box, Group, Menu, Text, TextInput } from '@mantine/core';
import { IconArchive, IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

export default function History(props: {
  selectedHistoryId: string | null | undefined;
  name: string;
  selected: boolean;
  onClick: () => void;
  onRename: (newHistoryName: string) => void;
  onRemove: () => void;
}) {
  const { selectedHistoryId, name, selected, onClick, onRename, onRemove } = props;
  const editInputRef = useRef<HTMLInputElement>(null);
  const [historyName, setHistoryName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setHistoryName(name);
    setIsEditing(false);
  }, [selectedHistoryId]);

  return (
    <Box
      className={selected && !isEditing ? classes.historySelected : classes.historyUnselected}
      component="a"
      h={36}
      p={isEditing ? 0 : 6}
      onClick={onClick}
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
              onRename(historyName);
              setIsEditing(false);
            } else if (event.key === 'Escape') {
              setHistoryName(name);
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <>
          <Group align="center" gap={4} w="100%">
            <Box className="relative h-full w-full grow overflow-hidden whitespace-nowrap">
              <Text c="white" className="h-full w-full" size="sm" ta="left">
                {name}
              </Text>
              <div className={selected ? classes.historyOverlaySelected : classes.historyOverlayUnselected} />
            </Box>
          </Group>
          <Group
            bottom={0}
            className={selected ? classes.historyActionsSelected : classes.historyActionsUnselected}
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
                  onClick={onRemove}
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
                onRemove();
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
