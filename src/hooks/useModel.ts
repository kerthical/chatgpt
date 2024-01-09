import { models } from '@/utils/constants.tsx';
import { atom, useAtom } from 'jotai';

const selectedModelAtom = atom<string>(models[0].id);
export function useModel() {
  const [selectedModelId, setSelectedModelId] = useAtom(selectedModelAtom);

  return {
    model: models.find(m => m.id === selectedModelId),
    selectModel: setSelectedModelId,
  };
}
