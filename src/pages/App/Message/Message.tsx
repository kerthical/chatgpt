import * as classes from '@/pages/App/Message/Message.css.ts';
import { ActionIcon, Avatar, Center, Group, Stack, Text } from '@mantine/core';
import { IconBrandOpenai, IconClipboard, IconEdit, IconReload } from '@tabler/icons-react';
import { marked } from 'marked';

export default function Message(props: { isLast: boolean; message: { role: string; content: string } }) {
  const { message, isLast } = props;

  return (
    <Group align="start" className={classes.messageContainer} gap="xs" p="md" w="100%" wrap="nowrap">
      {message.role === 'user' ? (
        <Avatar mih={26} miw={26} size={26} />
      ) : (
        <Center bg="#19c37d" className="rounded-full" h={26} mih={26} miw={26} w={26}>
          <IconBrandOpenai color="white" height="80%" stroke={1} width="80%" />
        </Center>
      )}
      <Stack gap={0} w="100%">
        <Text c="white" className="select-none" fw={700}>
          {message.role === 'user' ? 'あなた' : 'ChatGPT'}
        </Text>
        <Stack className="break-words lg:w-[calc(100%-115px)]" gap="xs">
          <Text
            c="gray"
            className={classes.messageContent}
            dangerouslySetInnerHTML={{
              __html: marked(message.content, {
                gfm: true,
                pedantic: true,
              }),
            }}
          />
          <Group className={classes.messageActions} gap={4}>
            {message.role === 'user' ? (
              <>
                <ActionIcon c="gray" size={20} variant="transparent">
                  <IconEdit />
                </ActionIcon>
              </>
            ) : (
              <>
                <ActionIcon c="gray" size={20} variant="transparent">
                  <IconClipboard />
                </ActionIcon>
                {isLast && (
                  <ActionIcon c="gray" size={20} variant="transparent">
                    <IconReload />
                  </ActionIcon>
                )}
              </>
            )}
          </Group>
        </Stack>
      </Stack>
    </Group>
  );
}
