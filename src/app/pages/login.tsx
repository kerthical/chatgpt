import { FlexForm } from '@/app/components/FlexForm';
import { useTranslator } from '@/app/hooks/useTranslator';
import { apikeyAtom } from '@/app/stores/apikey';
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

  const BG_COLOR = 'rgb(0, 0, 46)';
  const LOGO_TEXT_COLOR = 'rgb(210, 146, 255)';
  const LOGIN_BUTTON_COLOR = 'rgb(60,70,255)';

  return (
    <Group gap={0} h="100dvh" mah="100dvh" maw="100dvw" w="100dvw" wrap="nowrap">
      <Stack bg={BG_COLOR} h="100%" px="xl" py="lg" visibleFrom="sm" w="60%">
        <Title c={LOGO_TEXT_COLOR} fw={700} order={3}>
          ChatGPT●
        </Title>
        <Center flex={1}>
          <Title c={LOGO_TEXT_COLOR} fw={400} order={1}>
            <b>Write a text</b>
            <br />
            that goes with a kitten gif for a friend having a rough day
          </Title>
        </Center>
      </Stack>
      <Stack align="center" bg="black" flex={1} h="100%" justify="center" p="xl">
        <Title c="white" order={1}>
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
            bg={LOGIN_BUTTON_COLOR}
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
