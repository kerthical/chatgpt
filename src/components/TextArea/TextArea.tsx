import { FlexForm } from '@/components/FlexForm';
import { useTranslator } from '@/hooks/useTranslator.ts';
import { generatingTaskAtom, sendMessageAtom } from '@/stores/message.ts';
import { ActionIcon, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowUp, IconX } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import { useSetAtom } from 'jotai/index';
import { memo } from 'react';

import * as classes from './TextArea.css.ts';

export const TextArea = memo(() => {
  const translate = useTranslator('main');
  const sendMessage = useSetAtom(sendMessageAtom);
  const generatingTask = useAtomValue(generatingTaskAtom);
  const form = useForm({
    initialValues: {
      message: '',
    },
    validate: {
      message: value => value.trim().length <= 0,
    },
    validateInputOnChange: true,
  });

  return (
    <FlexForm
      align="center"
      direction="column"
      justify="center"
      onSubmit={form.onSubmit(({ message }) => {
        form.reset();
        sendMessage(message, []).catch(console.error);
      })}
      px={{
        base: 16,
      }}
      w="100%"
    >
      <Textarea
        autoFocus
        autosize
        className={classes.textArea}
        maw={{ sm: '720px' }}
        onKeyPress={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.reset();
            sendMessage(form.values.message, []).catch(console.error);
          }
        }}
        placeholder={translate('send_message_placeholder')}
        pr="0.5rem"
        radius="lg"
        rightSection={
          generatingTask ? (
            <ActionIcon
              c="black"
              className={classes.sendButton}
              disabled={generatingTask === true}
              onClick={() => {
                if (generatingTask !== true) {
                  generatingTask.abort();
                }
              }}
              size={30}
              variant="white"
            >
              <IconX className={classes.sendButtonIcon} />
            </ActionIcon>
          ) : (
            <ActionIcon
              c="black"
              className={classes.sendButton}
              disabled={!form.isValid()}
              size={30}
              type="submit"
              variant="white"
            >
              <IconArrowUp className={classes.sendButtonIcon} />
            </ActionIcon>
          )
        }
        size="lg"
        w="100%"
        {...form.getInputProps('message')}
      />
    </FlexForm>
  );
});

TextArea.displayName = 'TextArea';
