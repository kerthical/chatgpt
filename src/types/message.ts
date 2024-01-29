/**
 * Message attachment (e.g. image, pdf, etc.)
 */
export interface Attachment {
  /**
   * The UUID of the attachment
   */
  uuid: string;

  /**
   * The name of the attachment
   */
  name: string;

  /**
   * The URL of the attachment (base64 encoded. no remote url)
   */
  url: string;
}

/**
 * A message from the user
 */
export interface UserMessage {
  role: 'user';

  /**
   * The UUID of the message
   */
  uuid: string;

  /**
   * The content of the message
   */
  content: string;

  /**
   * The attachments of the message
   */
  attachments: Attachment[];
}

/**
 * Assistant tool call
 */
export interface ToolCall {
  /**
   * The UUID of the tool call
   */
  uuid: string;

  /**
   * The function name of the tool
   */
  name: string;

  /**
   * The arguments of the tool (JSON format)
   */
  arguments: string;

  /**
   * The output of the tool (if null, the tool is still running)
   */
  output: null | string;
}

/**
 * A message from the assistant
 */
export interface AssistantMessage {
  role: 'assistant';

  /**
   * The UUID of the message
   */
  uuid: string;

  /**
   * The content of the message
   */
  content: string;

  /**
   * The tool call of the message
   */
  toolCall: ToolCall | null;
}

/**
 * Type of message displayed on screen
 */
export type Message = AssistantMessage | UserMessage;

/**
 * Checks if a message is a user message
 * @param message The message to check
 * @returns Whether the message is a user message
 */
export function isUserMessage(message: Message): message is UserMessage {
  return message.role === 'user';
}

/**
 * Checks if a message is an assistant message
 * @param message The message to check
 * @returns Whether the message is an assistant message
 */
export function isAssistantMessage(message: Message): message is AssistantMessage {
  return message.role === 'assistant';
}
