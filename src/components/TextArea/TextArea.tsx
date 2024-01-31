import { FlexForm } from '@/components/FlexForm';
import { useTranslator } from '@/hooks/useTranslator.ts';
import { sendMessageAtom } from '@/stores/message.ts';
import { ActionIcon, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useColorScheme } from '@mantine/hooks';
import { IconArrowUp } from '@tabler/icons-react';
import { useSetAtom } from 'jotai/index';
import { memo } from 'react';

import * as classes from './TextArea.css.ts';

export const TextArea = memo(() => {
  const translate = useTranslator('main');
  const sendMessage = useSetAtom(sendMessageAtom);
  const colorScheme = useColorScheme();
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
        }
        size="lg"
        styles={{
          input: {
            fontSize: '16px',
            color: 'white',
            background: 'transparent',
            borderColor: colorScheme === 'dark' ? 'rgba(217, 217, 227, 0.2)' : 'rgba(0, 0, 0, 0.2)',
            padding: '14px 0px 14px 16px',
            lineHeight: '24px',
          },
        }}
        w="100%"
        {...form.getInputProps('message')}
      />
    </FlexForm>
  );
});

TextArea.displayName = 'TextArea';
