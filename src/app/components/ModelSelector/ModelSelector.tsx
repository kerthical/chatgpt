import type { ModelProps } from '@/app/components';

import { Model } from '@/app/components';
import { useResponsive, useTranslator } from '@/app/hooks';
import { selectedModelIdAtom } from '@/app/stores';
import { Group, Menu, Text } from '@mantine/core';
import { IconBolt, IconChevronDown, IconSparkles } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import { memo, useState } from 'react';

import classes from './ModelSelector.module.css';

export const ModelSelector = memo(() => {
  const { isMobile } = useResponsive();
  const [isModelSelectorOpen, setModelSelectorOpen] = useState(false);
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
    <Menu
      onChange={setModelSelectorOpen}
      opened={isModelSelectorOpen}
      position={isMobile ? 'bottom' : 'bottom-start'}
      styles={{
        dropdown: {
          backgroundColor: 'rgb(32, 33, 35)',
          borderColor: 'rgb(64, 65, 79)',
        },
      }}
      width={360}
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
          <Model key={model.id} {...model} />
        ))}
      </Menu.Dropdown>
    </Menu>
  );
});

ModelSelector.displayName = 'ModelSelector';
