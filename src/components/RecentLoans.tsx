import React, { useEffect, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { useQuizStore } from '../store/quiz';

const countryLoans = {
  ua: [
    { id: 1, name: 'Олена К.', amount: 15000, bank: 'Приват Банк', date: '2 мин. назад' },
    { id: 2, name: 'Михайло П.', amount: 25000, bank: 'Моно Банк', date: '5 мин. назад' },
    { id: 3, name: 'Ірина В.', amount: 20000, bank: 'ПУМБ', date: '7 мин. назад' },
    { id: 4, name: 'Андрій С.', amount: 30000, bank: 'Приват Банк', date: '8 мин. назад' },
    { id: 5, name: 'Марія Д.', amount: 18000, bank: 'Моно Банк', date: '10 мин. назад' },
    { id: 6, name: 'Василь К.', amount: 22000, bank: 'ПУМБ', date: '12 мин. назад' },
    { id: 7, name: 'Наталія П.', amount: 27000, bank: 'Приват Банк', date: '15 мин. назад' },
    { id: 8, name: 'Сергій М.', amount: 35000, bank: 'Моно Банк', date: '17 мин. назад' },
    { id: 9, name: 'Юлія В.', amount: 16000, bank: 'ПУМБ', date: '20 мин. назад' },
    { id: 10, name: 'Олександр К.', amount: 28000, bank: 'Приват Банк', date: '22 мин. назад' },
    { id: 11, name: 'Тетяна Р.', amount: 19000, bank: 'Моно Банк', date: '25 мин. назад' },
    { id: 12, name: 'Максим С.', amount: 31000, bank: 'ПУМБ', date: '27 мин. назад' },
    { id: 13, name: 'Людмила В.', amount: 23000, bank: 'Приват Банк', date: '30 мин. назад' },
    { id: 14, name: 'Віктор П.', amount: 26000, bank: 'Моно Банк', date: '32 мин. назад' },
    { id: 15, name: 'Оксана М.', amount: 17000, bank: 'ПУМБ', date: '35 мин. назад' },
    { id: 16, name: 'Роман К.', amount: 33000, bank: 'Приват Банк', date: '37 мин. назад' },
    { id: 17, name: 'Ганна С.', amount: 21000, bank: 'Моно Банк', date: '40 мин. назад' },
    { id: 18, name: 'Павло В.', amount: 29000, bank: 'ПУМБ', date: '42 мин. назад' },
    { id: 19, name: 'Софія Д.', amount: 24000, bank: 'Приват Банк', date: '45 мин. назад' },
    { id: 20, name: 'Іван М.', amount: 32000, bank: 'Моно Банк', date: '47 мин. назад' },
  ],
  kz: [
    { id: 1, name: 'Айдар Н.', amount: 150000, bank: 'Халык Банк', date: '3 мин. назад' },
    { id: 2, name: 'Динара М.', amount: 200000, bank: 'Kaspi Bank', date: '6 мин. назад' },
    { id: 3, name: 'Арман К.', amount: 100000, bank: 'ForteBank', date: '8 мин. назад' },
    { id: 4, name: 'Асель Т.', amount: 180000, bank: 'Халык Банк', date: '10 мин. назад' },
    { id: 5, name: 'Бауыржан С.', amount: 250000, bank: 'Kaspi Bank', date: '12 мин. назад' },
    { id: 6, name: 'Гульнара Р.', amount: 120000, bank: 'ForteBank', date: '15 мин. назад' },
    { id: 7, name: 'Дархан К.', amount: 300000, bank: 'Халык Банк', date: '17 мин. назад' },
    { id: 8, name: 'Жанар М.', amount: 170000, bank: 'Kaspi Bank', date: '20 мин. назад' },
    { id: 9, name: 'Ерлан С.', amount: 220000, bank: 'ForteBank', date: '22 мин. назад' },
    { id: 10, name: 'Зарина Н.', amount: 190000, bank: 'Халык Банк', date: '25 мин. назад' },
    { id: 11, name: 'Ильяс К.', amount: 280000, bank: 'Kaspi Bank', date: '27 мин. назад' },
    { id: 12, name: 'Камила Т.', amount: 150000, bank: 'ForteBank', date: '30 мин. назад' },
    { id: 13, name: 'Марат Р.', amount: 260000, bank: 'Халык Банк', date: '32 мин. назад' },
    { id: 14, name: 'Нургуль С.', amount: 210000, bank: 'Kaspi Bank', date: '35 мин. назад' },
    { id: 15, name: 'Олжас К.', amount: 230000, bank: 'ForteBank', date: '37 мин. назад' },
    { id: 16, name: 'Перизат М.', amount: 270000, bank: 'Халык Банк', date: '40 мин. назад' },
    { id: 17, name: 'Рустем Н.', amount: 240000, bank: 'Kaspi Bank', date: '42 мин. назад' },
    { id: 18, name: 'Сауле Т.', amount: 290000, bank: 'ForteBank', date: '45 мин. назад' },
    { id: 19, name: 'Тимур С.', amount: 200000, bank: 'Халык Банк', date: '47 мин. назад' },
    { id: 20, name: 'Умит К.', amount: 310000, bank: 'Kaspi Bank', date: '50 мин. назад' },
  ],
  ru: [
    { id: 1, name: 'Анна С.', amount: 50000, bank: 'СберБанк', date: '2 мин. назад' },
    { id: 2, name: 'Михаил К.', amount: 75000, bank: 'Тинькофф', date: '5 мин. назад' },
    { id: 3, name: 'Елена В.', amount: 30000, bank: 'Альфа-Банк', date: '7 мин. назад' },
    { id: 4, name: 'Дмитрий П.', amount: 60000, bank: 'СберБанк', date: '9 мин. назад' },
    { id: 5, name: 'Ольга М.', amount: 45000, bank: 'Тинькофф', date: '12 мин. назад' },
    { id: 6, name: 'Сергей К.', amount: 80000, bank: 'Альфа-Банк', date: '15 мин. назад' },
    { id: 7, name: 'Наталья Р.', amount: 35000, bank: 'СберБанк', date: '17 мин. назад' },
    { id: 8, name: 'Александр С.', amount: 70000, bank: 'Тинькофф', date: '20 мин. назад' },
    { id: 9, name: 'Ирина Д.', amount: 55000, bank: 'Альфа-Банк', date: '22 мин. назад' },
    { id: 10, name: 'Павел М.', amount: 65000, bank: 'СберБанк', date: '25 мин. назад' },
    { id: 11, name: 'Татьяна К.', amount: 40000, bank: 'Тинькофф', date: '27 мин. назад' },
    { id: 12, name: 'Андрей В.', amount: 85000, bank: 'Альфа-Банк', date: '30 мин. назад' },
    { id: 13, name: 'Марина С.', amount: 50000, bank: 'СберБанк', date: '32 мин. назад' },
    { id: 14, name: 'Виктор П.', amount: 72000, bank: 'Тинькофф', date: '35 мин. назад' },
    { id: 15, name: 'Юлия К.', amount: 58000, bank: 'Альфа-Банк', date: '37 мин. назад' },
    { id: 16, name: 'Роман М.', amount: 63000, bank: 'СберБанк', date: '40 мин. назад' },
    { id: 17, name: 'Светлана В.', amount: 47000, bank: 'Тинькофф', date: '42 мин. назад' },
    { id: 18, name: 'Денис С.', amount: 82000, bank: 'Альфа-Банк', date: '45 мин. назад' },
    { id: 19, name: 'Евгения К.', amount: 53000, bank: 'СберБанк', date: '47 мин. назад' },
    { id: 20, name: 'Артем П.', amount: 68000, bank: 'Тинькофф', date: '50 мин. назад' },
  ],
};

const currencySymbols = {
  ua: '₴',
  kz: '₸',
  ru: '₽',
};

export function RecentLoans() {
  const country = useQuizStore((state) => state.country);
  const step = useQuizStore((state) => state.step);
  const quizSteps = 6;
  const [currentLoanIndex, setCurrentLoanIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (step < quizSteps || !country) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentLoanIndex((prev) => (prev + 1) % (countryLoans[country]?.length || 1));
        setIsAnimating(false);
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, [step, country]);

  if (step < quizSteps || !country) {
    return null;
  }

  const loans = countryLoans[country] || [];
  const currencySymbol = currencySymbols[country] || '';
  const currentLoan = loans[currentLoanIndex];

  return (
    <div className="w-full overflow-hidden bg-white/50 backdrop-blur-sm rounded-lg p-4 animate-fadeIn">
      <div className="flex items-center gap-2 mb-3">
        <CreditCard className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-medium">Последние выданные займы</h3>
      </div>
      <div 
        className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="flex items-center justify-between text-sm p-2 bg-white rounded border border-gray-100">
          <div className="flex items-center gap-2">
            <span className="font-medium">{currentLoan.name}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{currentLoan.bank}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {currentLoan.amount.toLocaleString('ru-RU')} {currencySymbol}
            </span>
            <span className="text-xs text-gray-500">{currentLoan.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}