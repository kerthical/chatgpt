import { useGeneratingTask } from '@/hooks/useGeneratingTask.ts';
import { useMessages } from '@/hooks/useMessages.ts';
import { useModel } from '@/hooks/useModel.ts';
import { History, fromJSONtoHistory } from '@/types/History.ts';
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
        .filter((h: History | null) => h !== null)
        .map((h: History | null) => h!),
    );
  }, []);

  return {
    histories,
    setHistories: (histories: History[] | ((histories: History[]) => History[])) => {
      if (typeof histories === 'function') {
        setHistories(prev => {
          const next = histories(prev);
          localStorage.setItem('history', JSON.stringify(next.map(h => h.toJSON())));
          return next;
        });
      } else {
        setHistories(histories);
        localStorage.setItem('history', JSON.stringify(histories.map(h => h.toJSON())));
      }
    },
    selectedHistory,
    selectHistory: (id: string) => {
      if (selectedHistoryId !== id) {
        setSelectedHistoryId(id);

        const selectedHistory = histories.find(h => h.id === id);
        if (selectedHistory) {
          document.title = `ChatGPT - ${selectedHistory.name}`;
          setMessages(selectedHistory.messages);
          selectModel(selectedHistory.model);
        }
      }
    },
    newHistory: () => {
      cancelGeneration();
      setSelectedHistoryId(null);
      setMessages([]);
    },
  };
}
