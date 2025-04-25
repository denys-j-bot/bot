import { create } from 'zustand';

interface QuizState {
  started: boolean;
  step: number;
  country: string;
  gender: string;
  age: number | null;
  hasChildren: boolean | null;
  employmentType: string;
  loanPurpose: string;
  setStarted: (started: boolean) => void;
  setField: (field: keyof QuizState, value: any) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  started: false,
  step: 0,
  country: '',
  gender: '',
  age: null,
  hasChildren: null,
  employmentType: '',
  loanPurpose: '',
  setStarted: (started) => set({ started }),
  setField: (field, value) => set({ [field]: value }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: Math.max(0, state.step - 1) })),
  reset: () => set({
    started: false,
    step: 0,
    country: '',
    gender: '',
    age: null,
    hasChildren: null,
    employmentType: '',
    loanPurpose: ''
  }),
}));