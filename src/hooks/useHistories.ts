import { useGenerate } from '@/hooks/useGenerate.ts';
import { useMessages } from '@/hooks/useMessages.ts';
import { useModel } from '@/hooks/useModel.ts';
import { History } from '@/types/History.ts';
import { useListState } from '@mantine/hooks';
import { useEffect, useState } from 'react';

export function useHistories() {
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>();
  const [histories, historyHandlers] = useListState<History>();
  const { selectModel } = useModel();
  const { messageHandlers } = useMessages();
  const { cancelGeneration } = useGenerate();
  const selectedHistory = histories.find(h => h.id === selectedHistoryId);

  useEffect(() => {
    historyHandlers.setState(JSON.parse(localStorage.getItem('history') || '[]'));
  }, []);

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(histories));
  }, [histories]);

  useEffect(() => {
    if (!histories || !selectedHistoryId) return;

    const selected = selectedHistory;

    if (selected) {
      document.title = `ChatGPT - ${selected.name}`;
      messageHandlers.setState(selected.messages);
      selectModel(selected.model);
    }
  }, [selectedHistoryId]);

  return {
    histories,
    historyHandlers,
    selectedHistory,
    selectHistory: setSelectedHistoryId,
    newHistory: () => {
      cancelGeneration();
      setSelectedHistoryId(null);
      messageHandlers.setState([]);
    },
  };
}
