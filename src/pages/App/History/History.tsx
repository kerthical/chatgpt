import * as classes from '@/pages/App/History/History.css.ts';
import { ActionIcon, Box, Group, Menu, Text } from '@mantine/core';
import { IconArchive, IconDots, IconEdit, IconTrash } from '@tabler/icons-react';

export default function History(props: { name: string; selected: boolean }) {
  const { name, selected } = props;
  return (
    <Box bg={selected ? '#343541' : 'transparent'} className={classes.history} component="button" h={36} p={6}>
      <Group gap={4} w="100%">
        <Text c="white" className="relative grow overflow-hidden whitespace-nowrap" size="sm" ta="left">
          {name}
          <div className={selected ? classes.historyOverlaySelected : classes.historyOverlayUnselected} />
        </Text>
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
            <ActionIcon c="gray" size={20} variant="transparent">
              <IconDots />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown className={classes.historyMenu}>
            <Menu.Item className={classes.historyMenuItem} leftSection={<IconEdit size={18} />}>
              チャットの名前を変更
            </Menu.Item>
            <Menu.Item c="red" className={classes.historyMenuItem} leftSection={<IconTrash size={18} />}>
              チャットを削除
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <ActionIcon c="gray" size={20} variant="transparent">
          <IconArchive />
        </ActionIcon>
      </Group>
    </Box>
  );
}
