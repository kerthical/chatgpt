import { FlexForm } from '@/components/FlexForm';
import { useTranslator } from '@/hooks/useTranslator.ts';
import { apikeyAtom } from '@/stores/apikey.ts';
import { Button, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSetAtom } from 'jotai/index';
import OpenAI, { APIError } from 'openai';
import { memo, useState } from 'react';

export const ApiKeyForm = memo(() => {
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

  const LOGIN_BUTTON_COLOR = 'rgb(60,70,255)';

  return (
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
  );
});

ApiKeyForm.displayName = 'ApiKeyForm';
