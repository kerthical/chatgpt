import * as classes from '@/pages/App/Navbar/Navbar.css.ts';
import { useHistories } from '@/hooks/useHistories.ts';
import { useNavbar } from '@/hooks/useNavbar.ts';
import { useResponsive } from '@/hooks/useResponsive.ts';
import History from '@/pages/App/Navbar/History/History.tsx';
import { ActionIcon, AppShell, Avatar, Box, Button, Center, Group, Menu, Modal, Stack, Text } from '@mantine/core';
import { useClickOutside, useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconBrandOpenai, IconEdit, IconLogout, IconSettings, IconX } from '@tabler/icons-react';
import { useState } from 'react';

export function Navbar() {
  const { isMobile } = useResponsive();
  const { closeNavbar, toggleNavbar } = useNavbar();
  const { histories, newHistory, setHistories } = useHistories();
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [accountMenuOpened, setAccountMenuOpened] = useState(false);
  const navbarRef = useClickOutside(() => isMobile && closeNavbar());

  return (
    <>
      <Modal centered opened={modalOpened} title="設定" onClose={closeModal}>
        <Button
          fullWidth
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
          会話履歴をすべて削除
        </Button>
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
              xs: 320,
              sm: 260,
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
                opened={accountMenuOpened}
                position="top"
                transitionProps={{
                  transition: 'pop',
                }}
                width={236}
                onChange={setAccountMenuOpened}
              >
                <Menu.Target>
                  <Button
                    c="white"
                    className={accountMenuOpened ? classes.accountMenuButtonOpened : classes.accountMenuButtonClosed}
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
                    leftSection={<IconSettings size={18} />}
                    onClick={() => {
                      openModal();
                      setAccountMenuOpened(false);
                    }}
                  >
                    設定
                  </Menu.Item>
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
