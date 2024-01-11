import { atom, useAtom } from 'jotai';
import OpenAI from 'openai';
import { Stream } from 'openai/streaming';
import { useEffect } from 'react';

import ChatCompletionChunk = OpenAI.ChatCompletionChunk;

const isGeneratingAtom = atom(false);
const generationTaskAtom = atom<Stream<ChatCompletionChunk> | null>(null);
const customMyselfAtom = atom<string | null>(null);
const custonInstructionAtom = atom<string | null>(null);

export function useGeneratingTask() {
  const [isGenerating, setGenerating] = useAtom(isGeneratingAtom);
  const [generationTask, setGenerationTask] = useAtom(generationTaskAtom);
  const [customMyself, setCustomMyself] = useAtom(customMyselfAtom);
  const [customInstruction, setCustomInstruction] = useAtom(custonInstructionAtom);

  useEffect(() => {
    const myself = localStorage.getItem('customMyself');
    if (myself) setCustomMyself(myself);

    const instruction = localStorage.getItem('customInstruction');
    if (instruction) setCustomInstruction(instruction);
  }, []);

  function cancelGeneration() {
    generationTask?.controller.abort();
    setGenerating(false);
    setGenerationTask(null);
  }

  return {
    generationTask,
    setGenerationTask,
    isGenerating,
    customMyself,
    setCustomMyself: (myself: string | null) => {
      setCustomMyself(myself);
      if (myself) localStorage.setItem('customMyself', myself);
      else localStorage.removeItem('customMyself');
    },
    customInstruction,
    setCustomInstruction: (instruction: string | null) => {
      setCustomInstruction(instruction);
      if (instruction) localStorage.setItem('customInstruction', instruction);
      else localStorage.removeItem('customInstruction');
    },
    setGenerating,
    cancelGeneration,
  };
}
