import { useGeneratingTask } from '@/hooks/useGeneratingTask.ts';
import { useMessages } from '@/hooks/useMessages.ts';
import { useModel } from '@/hooks/useModel.ts';
import { History, fromHistoryToJSON, fromJSONtoHistory } from '@/types/History.ts';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

const selectedHistoryAtom = atom<string | null>(null);
const historiesAtom = atom<History[]>([]);

export function useHistories() {
  const [selectedHistoryId, setSelectedHistoryId] = useAtom(selectedHistoryAtom);
  const [histories, setHistories] = useAtom(historiesAtom);
  const { selectModel } = useModel();
  const { setMessages } = useMessages();
  const { cancelGeneration } = useGeneratingTask();
  const selectedHistory = histories.find(h => h.id === selectedHistoryId);

  useEffect(() => {
    setHistories(
      JSON.parse(localStorage.getItem('history') || '[]')
        .map(fromJSONtoHistory)
        .filter((h: History | null) => !h)
        .map((h: History | null) => h!),
    );
  }, []);

  useEffect(() => {
    // TODO: historyが空になることが多い
    localStorage.setItem('history', JSON.stringify(histories.map(h => fromHistoryToJSON(h))));
  }, [histories]);

  useEffect(() => {
    if (!histories || !selectedHistoryId) return;

    if (selectedHistory) {
      document.title = `ChatGPT - ${selectedHistory.name}`;
      setMessages(selectedHistory.messages);
      selectModel(selectedHistory.model);
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
