import { models } from '@/utils/constants.tsx';
import { useState } from 'react';

export function useModel() {
  const [selectedModelId, setSelectedModelId] = useState(models[0].id);

  return {
    model: models.find(m => m.id === selectedModelId),
    selectModel: setSelectedModelId,
  };
}
