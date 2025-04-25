import React from 'react';
import { useQuizStore } from '../store/quiz';
import { cn } from '../lib/utils';

interface Option {
  value: string;
  label: string;
}

interface QuizStepProps {
  title: string;
  description: string;
  options: Option[];
  field: keyof typeof initialQuizState;
}

const initialQuizState = {
  country: '',
  gender: '',
  age: null,
  hasChildren: null,
  employmentType: '',
  loanPurpose: '',
};

export function QuizStep({ title, description, options, field }: QuizStepProps) {
  const value = useQuizStore((state) => state[field]);
  const setField = useQuizStore((state) => state.setField);
  const nextStep = useQuizStore((state) => state.nextStep);

  const handleSelect = (optionValue: string) => {
    setField(field, optionValue);
    nextStep();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6 animate-fadeIn">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={cn(
              "w-full text-left px-4 py-3 rounded-lg border transition-all",
              value === option.value
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}