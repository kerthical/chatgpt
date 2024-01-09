import { useGeneratingTask } from '@/hooks/useGeneratingTask.ts';
import { useMessages } from '@/hooks/useMessages.ts';
import { useModel } from '@/hooks/useModel.ts';
import { History } from '@/types/History.ts';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

const selectedHistoryAtom = atom<string | null>(null);
const historiesAtom = atom<History[]>([]);

export function useHistories() {
  const [selectedHistoryId, setSelectedHistoryId] = useAtom(selectedHistoryAtom);
  const [histories, setHistories] = useAtom(historiesAtom);
  const { selectModel } = useModel();
  const { setMessages } = useMessages();
  const selectedHistory = histories.find(h => h.id === selectedHistoryId);
  const { cancelGeneration } = useGeneratingTask();

  useEffect(() => {
    setHistories(JSON.parse(localStorage.getItem('history') || '[]'));
  }, []);

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(histories));
  }, [histories]);

  useEffect(() => {
    if (!histories || !selectedHistoryId) return;

    const selected = selectedHistory;

    if (selected) {
      document.title = `ChatGPT - ${selected.name}`;
      setMessages(selected.messages);
      selectModel(selected.model);
    }
  }, [selectedHistoryId]);

  return {
    histories,
    setHistories,
    selectedHistory,
    selectHistory: setSelectedHistoryId,
    newHistory: () => {
      cancelGeneration();
      setSelectedHistoryId(null);
      setMessages([]);
    },
  };
}
