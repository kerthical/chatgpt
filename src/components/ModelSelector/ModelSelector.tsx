import type { ModelProps } from '@/components/Model';

import { Model } from '@/components/Model';
import { useResponsive } from '@/hooks/useResponsive.ts';
import { useTranslator } from '@/hooks/useTranslator.ts';
import { selectedModelIdAtom } from '@/stores/model';
import { Group, Menu, Text } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { IconBolt, IconChevronDown, IconSparkles } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import { memo, useState } from 'react';

import * as classes from './ModelSelector.css.ts';

export const ModelSelector = memo(() => {
  const { isMobile } = useResponsive();
  const [isModelSelectorOpen, setModelSelectorOpen] = useState(false);
  const selectedModelId = useAtomValue(selectedModelIdAtom);
  const translate = useTranslator('header');
  const colorScheme = useColorScheme();
  const models: ModelProps[] = [
    {
      id: 'gpt-3.5-turbo-1106',
      generation: '3.5',
      description: translate('model.gpt-3.5'),
      icon: <IconBolt color={colorScheme === 'dark' ? 'white' : 'black'} size={18} stroke={2} />,
    },
    {
      id: 'gpt-4-turbo-preview',
      generation: '4',
      description: translate('model.gpt-4'),
      icon: <IconSparkles color={colorScheme === 'dark' ? 'white' : 'black'} size={18} stroke={2} />,
    },
  ];

  const selectedModel = models.find(model => model.id === selectedModelId);

  return (
    <Menu
      onChange={setModelSelectorOpen}
      opened={isModelSelectorOpen}
      position={isMobile ? 'bottom' : 'bottom-start'}
      styles={{
        dropdown: {
          backgroundColor: colorScheme === 'dark' ? 'rgb(32, 33, 35)' : 'white',
          borderColor: colorScheme === 'dark' ? 'rgb(64, 65, 79)' : 'rgb(236, 236, 241)',
        },
      }}
      width={360}
    >
      <Menu.Target>
        <Group
          className={isModelSelectorOpen ? classes.modelButtonOpened : classes.modelButtonClosed}
          component="button"
          gap={2}
        >
          <Text c={colorScheme === 'dark' ? 'white' : 'black'} fw={700} size="lg">
            ChatGPT{` `}
            <Text c={colorScheme === 'dark' ? 'gray' : 'gray.7'} fw={700} span>
              {selectedModel?.generation}
            </Text>
          </Text>
          <IconChevronDown color="gray" size={16} stroke={3} />
        </Group>
      </Menu.Target>
      <Menu.Dropdown className={classes.modelSelector}>
        {models.map(model => (
          <Model key={model.id} {...model} />
        ))}
      </Menu.Dropdown>
    </Menu>
  );
});

ModelSelector.displayName = 'ModelSelector';
