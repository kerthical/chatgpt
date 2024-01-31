import { FlexForm } from '@/components/FlexForm';
import { useTranslator } from '@/hooks/useTranslator.ts';
import { sendMessageAtom } from '@/stores/message.ts';
import { Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useColorScheme } from '@mantine/hooks';
import { useSetAtom } from 'jotai/index';
import { memo } from 'react';

export const TextArea = memo(() => {
  const translate = useTranslator('main');
  const sendMessage = useSetAtom(sendMessageAtom);
  const colorScheme = useColorScheme();
  const form = useForm({
    initialValues: {
      message: '',
    },
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
        base: 'sm',
        sm: 'xl',
      }}
      w="100%"
    >
      <Textarea
        autoFocus
        autosize
        maw={{ sm: '720px' }}
        onKeyPress={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            form.reset();
            sendMessage(form.values.message, []).catch(console.error);
          }
        }}
        placeholder={translate('send_message_placeholder')}
        radius="lg"
        size="lg"
        styles={{
          input: {
            background: 'transparent',
            borderColor: colorScheme === 'dark' ? 'rgba(217, 217, 227, 0.2)' : 'rgba(0, 0, 0, 0.2)',
          },
        }}
        w="100%"
        {...form.getInputProps('message')}
      />
    </FlexForm>
  );
});

TextArea.displayName = 'TextArea';
