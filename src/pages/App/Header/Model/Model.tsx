import * as classes from '@/pages/App/Header/Model/Model.css.ts';
import { useModel } from '@/hooks/useModel.ts';
import { Model as ModelType } from '@/types/Model.ts';
import { Group, Menu, Stack, Text } from '@mantine/core';
import { IconCircle, IconCircleCheckFilled } from '@tabler/icons-react';

export function Model(props: { model: ModelType }) {
  const { model, selectModel } = useModel();

  return (
    <Menu.Item className={classes.modelSelectorItem} onClick={() => selectModel(props.model.id)}>
      <Group align="center" justify="space-between" wrap="nowrap">
        <Group>
          {props.model.icon}
          <Stack gap={0}>
            <Text c="white" size="sm">
              {props.model.name}
            </Text>
            <Text c="gray.6" size="sm">
              {props.model.description}
            </Text>
          </Stack>
        </Group>
        {props.model.id === model?.id ? (
          <IconCircleCheckFilled color="white" size={18} />
        ) : (
          <IconCircle color="gray" size={18} stroke={2} />
        )}
      </Group>
    </Menu.Item>
  );
}
