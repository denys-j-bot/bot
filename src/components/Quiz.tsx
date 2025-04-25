import React from 'react';
import { useQuizStore } from '../store/quiz';
import { QuizStep } from './QuizStep';
import { ArrowLeft } from 'lucide-react';

const quizSteps = [
  {
    title: 'Выберите страну',
    description: 'В какой стране вы проживаете?',
    field: 'country',
    options: [
      { value: 'ua', label: 'Украина' },
      { value: 'kz', label: 'Казахстан' },
      { value: 'ru', label: 'Россия' },
    ],
  },
  {
    title: 'Укажите ваш пол',
    description: 'Это поможет нам подобрать подходящие предложения',
    field: 'gender',
    options: [
      { value: 'male', label: 'Мужской' },
      { value: 'female', label: 'Женский' },
    ],
  },
  {
    title: 'Сколько вам лет?',
    description: 'Выберите вашу возрастную группу',
    field: 'age',
    options: [
      { value: '18-25', label: '18-25 лет' },
      { value: '26-35', label: '26-35 лет' },
      { value: '36-45', label: '36-45 лет' },
      { value: '46+', label: '46 и старше' },
    ],
  },
  {
    title: 'У вас есть дети?',
    description: 'Это может повлиять на условия кредитования',
    field: 'hasChildren',
    options: [
      { value: 'yes', label: 'Да' },
      { value: 'no', label: 'Нет' },
    ],
  },
  {
    title: 'Тип занятости',
    description: 'Укажите ваш текущий статус занятости',
    field: 'employmentType',
    options: [
      { value: 'employed', label: 'Работаю по найму' },
      { value: 'self-employed', label: 'Предприниматель' },
      { value: 'retired', label: 'Пенсионер' },
      { value: 'student', label: 'Студент' },
    ],
  },
  {
    title: 'Цель займа',
    description: 'На что планируете потратить средства?',
    field: 'loanPurpose',
    options: [
      { value: 'personal', label: 'Личные нужды' },
      { value: 'business', label: 'Развитие бизнеса' },
      { value: 'education', label: 'Образование' },
      { value: 'medical', label: 'Медицинские услуги' },
    ],
  },
];

export function Quiz() {
  const step = useQuizStore((state) => state.step);
  const prevStep = useQuizStore((state) => state.prevStep);
  const currentStep = quizSteps[step];

  if (!currentStep) {
    return null;
  }

  return (
    <div>
      {step > 0 && (
        <button
          onClick={prevStep}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </button>
      )}
      <QuizStep {...currentStep} />
    </div>
  );
}