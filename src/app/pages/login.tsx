import { ApiKeyForm } from '@/components/ApiKeyForm';
import { useTranslator } from '@/hooks/useTranslator.ts';
import { Center, Group, Stack, Title } from '@mantine/core';

export default function Login() {
  const translate = useTranslator('login');

  const BG_COLOR = 'rgb(0, 0, 46)';
  const LOGO_TEXT_COLOR = 'rgb(210, 146, 255)';

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
        <ApiKeyForm />
      </Stack>
    </Group>
  );
}
