import { Message, fromJSONtoMessage } from '@/types/Message.ts';

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
      .filter(m => m !== null)
      .map(m => m!),
  );
}
export class History {
  constructor(
    public id: string,
    public name: string,
    public model: string,
    public messages: Message[] = [],
  ) {}

  addMessage(message: Message) {
    this.messages.push(message);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      model: this.model,
      messages: this.messages.map(m => m.toJSON()),
    };
  }
}
