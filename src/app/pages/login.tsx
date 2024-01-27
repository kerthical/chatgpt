import { FlexForm } from '@/components/FlexForm';
import { useTranslator } from '@/hooks/useTranslator';
import { apikeyAtom } from '@/stores/apikey';
import { Button, Center, Group, PasswordInput, Stack, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSetAtom } from 'jotai/index';
import OpenAI, { APIError } from 'openai';
import { useState } from 'react';

export default function Login() {
  const translate = useTranslator('login');
  const setApiKey = useSetAtom(apikeyAtom);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      apikey: '',
    },
    validate: {
      apikey: value => (value.trim().length <= 0 ? translate('enter_api_key') : null),
    },
    validateInputOnChange: true,
  });

  return (
    <Group gap={0} h="100dvh" mah="100dvh" maw="100dvw" w="100dvw" wrap="nowrap">
      <Stack bg="#00002e" h="100%" px="xl" py="lg" visibleFrom="sm" w="60%">
        <Title c="#d292ff" fw={700} order={3}>
          ChatGPT●
        </Title>
        <Center flex={1}>
          <Title c="#d292ff" fw={400} order={1}>
            <b>Write a text</b>
            <br />
            that goes with a kitten gif for a friend having a rough day
          </Title>
        </Center>
      </Stack>
      <Stack align="center" bg="black" flex={1} h="100%" justify="center" p="xl">
        <Title c="#ffffff" order={1}>
          {translate('login')}
        </Title>
        <FlexForm
          direction="column"
          gap="sm"
          onSubmit={form.onSubmit(({ apikey }) => {
            setLoading(true);
            const client = new OpenAI({ apiKey: apikey, dangerouslyAllowBrowser: true });
            client.models
              .list()
              .then(() => {
                setApiKey(apikey);
              })
              .catch(e => {
                if (e instanceof APIError && e.status === 401) {
                  form.setFieldError('apikey', translate('invalid_api_key'));
                } else {
                  console.error(e);
                }
              })
              .finally(() => {
                setLoading(false);
              });
          })}
          w="100%"
        >
          <PasswordInput
            placeholder={translate('enter_api_key_placeholder')}
            radius="lg"
            size="lg"
            variant="filled"
            w="100%"
            {...form.getInputProps('apikey')}
          />
          <Button
            bg="#3c46ff"
            disabled={!form.isValid()}
            fullWidth
            loading={loading}
            radius="lg"
            size="lg"
            type="submit"
          >
            {translate('login')}
          </Button>
        </FlexForm>
      </Stack>
    </Group>
  );
}
