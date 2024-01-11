import * as classes from '@/pages/App/Header/Header.css.ts';
import { useHistories } from '@/hooks/useHistories.ts';
import { useModel } from '@/hooks/useModel.ts';
import { useNavbar } from '@/hooks/useNavbar.ts';
import { useResponsive } from '@/hooks/useResponsive.ts';
import { Model } from '@/pages/App/Header/Model/Model.tsx';
import { models } from '@/utils/constants.tsx';
import { ActionIcon, AppShell, Group, Menu, Text } from '@mantine/core';
import { IconChevronDown, IconEdit, IconMenu } from '@tabler/icons-react';
import { useState } from 'react';

export function Header() {
  const [modelSelectorOpened, setModelSelectorOpened] = useState(false);
  const { isNavbarOpened, toggleNavbar } = useNavbar();
  const { model } = useModel();
  const { newHistory } = useHistories();
  const { isMobile } = useResponsive();

  return (
    <AppShell.Header>
      <Group align="center" h="100%" justify="space-between" p={8} w="100%">
        <ActionIcon c="white" hiddenFrom="sm" onClick={toggleNavbar} size="sm" variant="transparent">
          <IconMenu />
        </ActionIcon>
        <Group align="center" gap="xs">
          {!isNavbarOpened && (
            <ActionIcon c="white" onClick={newHistory} p={6} size="lg" variant="default" visibleFrom="sm">
              <IconEdit />
            </ActionIcon>
          )}
          <Menu
            onChange={setModelSelectorOpened}
            opened={modelSelectorOpened}
            position={isMobile ? 'bottom' : 'bottom-start'}
          >
            <Menu.Target>
              <Group
                align="center"
                className={modelSelectorOpened ? classes.modelSelectorButtonOpened : classes.modelSelectorButtonClosed}
                component="button"
                gap={2}
              >
                <Text c="white" fw={700} size="lg">
                  ChatGPT {` `}
                  <Text span c="gray" fw={700}>
                    {models.find(m => m.id === model?.id)?.version ?? model?.id}
                  </Text>
                </Text>
                <IconChevronDown color="gray" size={16} stroke={3} />
              </Group>
            </Menu.Target>
            <Menu.Dropdown className={classes.modelSelector}>
              {models.map(m => (
                <Model key={m.id} model={m} />
              ))}
            </Menu.Dropdown>
          </Menu>
        </Group>
        <ActionIcon c="white" hiddenFrom="sm" onClick={newHistory} size="sm" variant="transparent">
          <IconEdit />
        </ActionIcon>
      </Group>
    </AppShell.Header>
  );
}
