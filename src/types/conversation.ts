import type { Message } from '@/types/message.ts';

/**
 * One conversation history
 */
export interface Conversation {
  /**
   * The UUID of the conversation
   */
  id: string;

  /**
   * The title of the conversation
   */
  title: string;

  /**
   * The last used model id of the conversation
   */
  modelId: string;

  /**
   * The messages of the conversation
   */
  messages: Message[];
}
