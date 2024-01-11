import * as classes from '@/pages/App/Navbar/Navbar.css.ts';
import { useGeneratingTask } from '@/hooks/useGeneratingTask.ts';
import { useHistories } from '@/hooks/useHistories.ts';
import { useNavbar } from '@/hooks/useNavbar.ts';
import { useResponsive } from '@/hooks/useResponsive.ts';
import History from '@/pages/App/Navbar/History/History.tsx';
import {
  ActionIcon,
  AppShell,
  Avatar,
  Box,
  Button,
  Center,
  Group,
  List,
  Menu,
  Modal,
  Stack,
  Text,
  Textarea,
  Tooltip,
} from '@mantine/core';
import { useClickOutside, useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconBookUpload, IconBrandOpenai, IconEdit, IconLogout, IconSettings, IconX } from '@tabler/icons-react';
import { useState } from 'react';

export function Navbar() {
  const { isMobile } = useResponsive();
  const { closeNavbar, toggleNavbar } = useNavbar();
  const { histories, newHistory, setHistories } = useHistories();
  const { customMyself, setCustomMyself, customInstruction, setCustomInstruction } = useGeneratingTask();
  const [isSettingModalOpened, { open: openSettingModal, close: closeSettingModal }] = useDisclosure(false);
  const [isInstructionsModalOpened, { open: openInstructionsModal, close: closeInstructionsModal }] =
    useDisclosure(false);
  const [isAccountMenuOpened, setAccountMenuOpened] = useState(false);
  const [editingMyself, setEditingMyself] = useState(customMyself);
  const [editingInstruction, setEditingInstruction] = useState(customInstruction);
  const navbarRef = useClickOutside(() => isMobile && closeNavbar());

  return (
    <>
      <Modal centered opened={isSettingModalOpened} title="設定" onClose={closeSettingModal}>
        <Group align="center" mt="lg" justify="space-between" w="100%">
          会話履歴をすべて削除
          <Button
            bg="red.8"
            onClick={() => {
              notifications.show({
                color: 'blue',
                title: '成功',
                message: '会話履歴をすべて削除しました。',
              });
              localStorage.removeItem('history');
              setHistories([]);
            }}
          >
            削除
          </Button>
        </Group>
      </Modal>
      <Modal
        centered
        withCloseButton={false}
        opened={isInstructionsModalOpened}
        title="カスタム指示"
        size="lg"
        onClose={closeInstructionsModal}
      >
        <Stack gap="sm" mt="lg">
          <Stack gap={2}>
            <Tooltip
              c="white"
              bg="#202123"
              position="right-start"
              label={
                <Stack gap={0} p="xs">
                  <Text size="sm" fw={700}>
                    アイデアの誘発
                  </Text>
                  <List>
                    <List.Item>あなたはどこに住んでいますか？</List.Item>
                    <List.Item>あなたの仕事は何ですか？</List.Item>
                    <List.Item>あなたの趣味や興味は何ですか？</List.Item>
                    <List.Item>何時間でも話せる話題は何ですか？</List.Item>
                    <List.Item>あなたの目標は何ですか？</List.Item>
                  </List>
                </Stack>
              }
            >
              <Textarea
                autosize
                label="ChatGPTにあなたについて何を知らせれば、より良い応答を提供できると思いますか？"
                minRows={8}
                maxRows={16}
                maxLength={1500}
                value={editingMyself ?? ''}
                styles={{
                  label: {
                    color: 'white',
                    marginBottom: 8,
                  },
                }}
                onChange={e => setEditingMyself(e.currentTarget.value)}
              />
            </Tooltip>
            <Text size="xs">{editingMyself?.length ?? 0}/1500</Text>
          </Stack>
          <Stack gap={2}>
            <Tooltip
              c="white"
              bg="#202123"
              position="right-start"
              label={
                <Stack gap={0} p="xs">
                  <Text size="sm" fw={700}>
                    アイデアの誘発
                  </Text>
                  <List>
                    <List.Item>ChatGPTはどの程度正式またはカジュアルであるべきですか？</List.Item>
                    <List.Item>一般的に、応答はどの程度の長さが適切でしょうか？</List.Item>
                    <List.Item>どのように呼びかけられたいですか？</List.Item>
                    <List.Item>
                      ChatGPTはトピックに対して意見を持つべきですか？それとも中立的であるべきですか？
                    </List.Item>
                  </List>
                </Stack>
              }
            >
              <Textarea
                autosize
                label="ChatGPTにどのように応答してほしいですか？"
                minRows={8}
                maxRows={16}
                maxLength={1500}
                value={editingInstruction ?? ''}
                styles={{
                  label: {
                    color: 'white',
                    marginBottom: 8,
                  },
                }}
                onChange={e => setEditingInstruction(e.currentTarget.value)}
              />
            </Tooltip>
            <Text size="xs">{editingInstruction?.length ?? 0}/1500</Text>
          </Stack>
          <Group align="center" justify="end" w="100%">
            <Button
              variant="outline"
              onClick={() => {
                setEditingMyself(customMyself);
                setEditingInstruction(customInstruction);
                closeInstructionsModal();
              }}
            >
              キャンセル
            </Button>
            <Button
              disabled={editingMyself === customMyself && editingInstruction === customInstruction}
              onClick={() => {
                notifications.show({
                  color: 'blue',
                  title: '成功',
                  message: 'カスタム指示を保存しました。',
                });
                setCustomMyself(editingMyself);
                setCustomInstruction(editingInstruction);
                closeInstructionsModal();
              }}
            >
              保存
            </Button>
          </Group>
        </Stack>
      </Modal>
      <AppShell.Navbar bg="rgba(0, 0, 0, 0.2)">
        <Group align="start" gap={0} h="100%" w="100%">
          <Box
            ref={navbarRef}
            bg="black"
            h="100%"
            px="sm"
            py="md"
            w={{
              base: 260,
              sm: 320,
            }}
          >
            <Stack align="center" h="100%">
              <Stack className="flex-1" w="100%">
                <Button
                  c="white"
                  className={classes.newChatButton}
                  h={40}
                  justify="space-between"
                  px="xs"
                  rightSection={<IconEdit size={18} />}
                  variant="subtle"
                  w="100%"
                  onClick={newHistory}
                >
                  <Group gap="xs">
                    <Center bg="white" className="rounded-full" h={28} w={28}>
                      <IconBrandOpenai color="black" height="80%" stroke={1} width="80%" />
                    </Center>
                    New chat
                  </Group>
                </Button>
                <Stack gap={0} w="100%">
                  {histories?.map(h => <History key={h.id} history={h} />)}
                </Stack>
              </Stack>
              <Menu
                opened={isAccountMenuOpened}
                position="top"
                width={236}
                transitionProps={{
                  transition: 'pop',
                }}
                onChange={setAccountMenuOpened}
              >
                <Menu.Target>
                  <Button
                    c="white"
                    className={isAccountMenuOpened ? classes.accountMenuButtonOpened : classes.accountMenuButtonClosed}
                    h={44}
                    justify="space-between"
                    px="xs"
                    variant="subtle"
                    w="100%"
                  >
                    <Group gap="xs">
                      <Avatar radius="xl" size={28} />
                      <Text size="sm">Account</Text>
                    </Group>
                  </Button>
                </Menu.Target>
                <Menu.Dropdown className={classes.accountMenu}>
                  <Menu.Item
                    className={classes.accountMenuItem}
                    leftSection={<IconBookUpload size={18} />}
                    onClick={() => {
                      openInstructionsModal();
                      setAccountMenuOpened(false);
                    }}
                  >
                    カスタム指示
                  </Menu.Item>
                  <Menu.Item
                    className={classes.accountMenuItem}
                    leftSection={<IconSettings size={18} />}
                    onClick={() => {
                      openSettingModal();
                      setAccountMenuOpened(false);
                    }}
                  >
                    設定
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    className={classes.accountMenuItem}
                    leftSection={<IconLogout size={18} />}
                    onClick={() => {
                      localStorage.removeItem('apiKey');
                      localStorage.removeItem('history');
                      window.location.reload();
                    }}
                  >
                    ログアウト
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Stack>
          </Box>
          <Box hiddenFrom="sm" p="sm">
            <ActionIcon c="white" size="sm" variant="transparent" onClick={toggleNavbar}>
              <IconX />
            </ActionIcon>
          </Box>
        </Group>
      </AppShell.Navbar>
    </>
  );
}
