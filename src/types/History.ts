import { Message, fromJSONtoMessage, fromMessageToJSON } from '@/types/Message.ts';
import { randomId } from '@mantine/hooks';

export function fromJSONtoHistory(history: unknown) {
  if (!history) return null;
  if (typeof history !== 'object') return null;
  if (!('id' in history)) return null;
  if (!('name' in history)) return null;
  if (!('model' in history)) return null;
  if (!('messages' in history)) return null;
  if (typeof history['id'] !== 'string') return null;
  if (typeof history['name'] !== 'string') return null;
  if (typeof history['model'] !== 'string') return null;
  if (!Array.isArray(history['messages'])) return null;

  return new History(
    history['id'],
    history['name'],
    history['model'],
    history['messages']
      .map((m: object) => fromJSONtoMessage(m))
      .filter(m => !m)
      .map(m => m!),
  );
}

export function fromHistoryToJSON(history: History) {
  return {
    id: history.id,
    name: history.name,
    model: history.model,
    messages: history.messages.map(m => fromMessageToJSON(m)),
  };
}

export class History {
  constructor(
    public id: string = randomId(),
    public name: string,
    public model: string,
    public messages: Message[] = [],
  ) {}

  addMessage(message: Message) {
    this.messages.push(message);
  }
}
