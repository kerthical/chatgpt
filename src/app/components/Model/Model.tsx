import type { ReactNode } from 'react';

import { selectedModelIdAtom } from '@/app/stores/model';
import { Group, Menu, Stack, Text } from '@mantine/core';
import { IconCircle, IconCircleCheckFilled } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { memo } from 'react';

import classes from './Model.module.css';

export interface ModelProps {
  /**
   * The id of the model.
   */
  id: string;

  /**
   * The model generation
   */
  generation: string;

  /**
   * Display description
   */
  description: string;

  /**
   * The model icon
   */
  icon: ReactNode;
}

export const Model = memo((props: ModelProps) => {
  const [selectedModelId, setSelectedModelId] = useAtom(selectedModelIdAtom);

  return (
    <Menu.Item className={classes['item']} onClick={() => setSelectedModelId(props.id)}>
      <Group justify="space-between" wrap="nowrap">
        <Group>
          {props.icon}
          <Stack gap={0}>
            <Text c="white" size="sm">
              GPT-{props.generation}
            </Text>
            <Text c="gray.6" size="sm">
              GPT-{props.description}
            </Text>
          </Stack>
        </Group>
        {selectedModelId === props.id ? (
          <IconCircleCheckFilled color="white" size={18} />
        ) : (
          <IconCircle color="gray.6" size={18} stroke={2} />
        )}
      </Group>
    </Menu.Item>
  );
});

Model.displayName = 'Model';
