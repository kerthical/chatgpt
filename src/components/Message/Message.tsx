import type { Message as MessageType } from '@/types/message.ts';
import type { PrimitiveAtom } from 'jotai';

import { useAtomValue } from 'jotai';
import { memo } from 'react';

interface MessageProps {
  message: PrimitiveAtom<MessageType>;
}

export const Message = memo<MessageProps>((props: MessageProps) => {
  const message = useAtomValue(props.message);

  return (
    <div>
      <div>{message.role}</div>
      <div>{message.content}</div>
    </div>
  );
});

Message.displayName = 'Message';
