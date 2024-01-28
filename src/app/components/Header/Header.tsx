import { useAppContext } from '@/app/components/App';
import { Model, ModelProps } from '@/app/components/Model';
import { useResponsive } from '@/app/hooks/useResponsive';
import { useTranslator } from '@/app/hooks/useTranslator';
import { selectedModelIdAtom } from '@/app/stores/model';
import { ActionIcon, AppShellHeader, Group, Menu, Text } from '@mantine/core';
import { IconBolt, IconChevronDown, IconEdit, IconMenu, IconSparkles } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import { memo, useState } from 'react';

import classes from './Header.module.css';

export const Header = memo(() => {
  const ctx = useAppContext();
  const [isModelSelectorOpen, setModelSelectorOpen] = useState(false);
  const { isMobile } = useResponsive();
  const selectedModelId = useAtomValue(selectedModelIdAtom);
  const translate = useTranslator('header');
  const models: ModelProps[] = [
    {
      id: 'gpt-3.5-turbo-1106',
      generation: '3.5',
      description: translate('model.gpt-3.5'),
      icon: <IconBolt color="white" size={18} stroke={2} />,
    },
    {
      id: 'gpt-4-turbo-preview',
      generation: '4',
      description: translate('model.gpt-4'),
      icon: <IconSparkles color="white" size={18} stroke={2} />,
    },
  ];

  const selectedModel = models.find(model => model.id === selectedModelId);

  return (
    <AppShellHeader>
      <Group h="100%" justify="space-between" p={8} w="100%">
        {/* TODO: newHistory */}
        <ActionIcon c="white" hiddenFrom="sm" onClick={() => ctx.toggleNavbar()} size="sm" variant="transparent">
          <IconMenu />
        </ActionIcon>
        <Group gap="xs">
          {!ctx.isNavbarOpen && (
            <ActionIcon c="white" p={6} size="lg" variant="default" visibleFrom="sm">
              <IconEdit />
            </ActionIcon>
          )}
          <Menu
            onChange={opened => setModelSelectorOpen(opened)}
            opened={isModelSelectorOpen}
            position={isMobile ? 'bottom' : 'bottom-start'}
          >
            <Menu.Target>
              <Group
                className={isModelSelectorOpen ? classes['model-button-opened'] : classes['model-button-closed']}
                component="button"
                gap={2}
              >
                <Text c="white" fw={700} size="lg">
                  ChatGPT{` `}
                  <Text c="gray" fw={700} span>
                    {selectedModel?.generation}
                  </Text>
                </Text>
                <IconChevronDown color="gray" size={16} stroke={3} />
              </Group>
            </Menu.Target>
            <Menu.Dropdown className={classes['model-selector']}>
              {models.map(model => (
                <Model
                  description={model.description}
                  generation={model.generation}
                  icon={model.icon}
                  id={model.id}
                  key={model.id}
                />
              ))}
            </Menu.Dropdown>
          </Menu>
        </Group>
        {/* TODO: newHistory */}
        <ActionIcon c="white" hiddenFrom="sm" size="sm" variant="transparent">
          <IconEdit />
        </ActionIcon>
      </Group>
    </AppShellHeader>
  );
});

Header.displayName = 'Header';
