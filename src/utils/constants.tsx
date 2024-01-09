import { Model } from '@/types/Model.ts';
import { IconBolt, IconSparkles } from '@tabler/icons-react';

export const models: Model[] = [
  {
    id: 'gpt-3.5-turbo-1106',
    name: 'GPT-3.5',
    version: '3.5',
    description: '日常のタスクに最適',
    icon: <IconBolt color="white" size={18} stroke={2} />,
  },
  {
    id: 'gpt-4-vision-preview',
    name: 'GPT-4',
    version: '4',
    description: '私たちの最も賢く、最も能力のあるモデル。',
    icon: <IconSparkles color="white" size={18} stroke={2} />,
  },
];
