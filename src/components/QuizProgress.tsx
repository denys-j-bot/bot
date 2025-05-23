import React from 'react';
import { useQuizStore } from '../store/quiz';

const TOTAL_STEPS = 6;

export function QuizProgress() {
  const step = useQuizStore((state) => state.step);
  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}