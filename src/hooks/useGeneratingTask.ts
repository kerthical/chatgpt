import { atom, useAtom } from 'jotai';
import OpenAI from 'openai';
import { Stream } from 'openai/streaming';

import ChatCompletionChunk = OpenAI.ChatCompletionChunk;

const isGeneratingAtom = atom(false);
const generationTaskAtom = atom<Stream<ChatCompletionChunk> | null>(null);

export function useGeneratingTask() {
  const [isGenerating, setGenerating] = useAtom(isGeneratingAtom);
  const [generationTask, setGenerationTask] = useAtom(generationTaskAtom);

  function cancelGeneration() {
    generationTask?.controller.abort();
    setGenerating(false);
    setGenerationTask(null);
  }

  return {
    generationTask,
    setGenerationTask,
    isGenerating,
    setGenerating,
    cancelGeneration,
  };
}
