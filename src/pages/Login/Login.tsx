import { Button, Center, Group, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import OpenAI from 'openai';
import { useState } from 'react';

export default function Login() {
  const form = useForm({
    initialValues: {
      apiKey: '',
    },
    validate: {
      apiKey: value => (value.trim().length <= 0 ? 'APIキーを入力してください' : null),
    },
    validateInputOnChange: true,
  });
  const [loading, setLoading] = useState(false);

  return (
    <Group gap={0} h="100dvh" mah="100dvh" maw="100dvw" w="100dvw">
      <Stack bg="#00002e" h="100%" px="xl" py="lg" w="60%">
        <Title c="#d292ff" fw={700} order={3}>
          ChatGPT●
        </Title>
        <Center className="flex-1">
          <Title c="#d292ff" fw={400} order={1}>
            <b>Write a text </b>
            that goes with a kitten gif for a friend having a rough day●
          </Title>
        </Center>
      </Stack>
      <Stack align="center" bg="black" className="flex-1" h="100%" justify="center" p="xl">
        <Title c="white" order={1}>
          始めましょう
        </Title>
        <form
          className="flex w-full flex-col gap-2"
          onSubmit={form.onSubmit(async ({ apiKey }) => {
            try {
              setLoading(true);
              const openAI = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
              await openAI.models.list();
              localStorage.setItem('apiKey', apiKey);
              window.location.reload();
            } catch (e) {
              form.setFieldError('apiKey', 'APIキーが無効です');
            } finally {
              setLoading(false);
            }
          })}
        >
          <TextInput
            placeholder="APIキーを入力..."
            radius="lg"
            size="lg"
            variant="filled"
            w="100%"
            {...form.getInputProps('apiKey')}
          />
          <Button
            fullWidth
            bg="#3c46ff"
            disabled={!form.isValid('apiKey')}
            loading={loading}
            radius="lg"
            size="lg"
            type="submit"
          >
            ログイン
          </Button>
        </form>
      </Stack>
    </Group>
  );
}
