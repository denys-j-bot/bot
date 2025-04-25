import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Wallet, Shield, Clock, CheckCircle, Sparkles, BadgeCheck } from 'lucide-react';
import { QuizProgress } from './components/QuizProgress';
import { RecentLoans } from './components/RecentLoans';
import { Quiz } from './components/Quiz';
import { LoanOffers } from './components/LoanOffers';
import { AdminPanel } from './components/AdminPanel';
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useQuizStore } from './store/quiz';
import { useEffect } from 'react'
function App() {
  const started = useQuizStore((state) => state.started);
  const setStarted = useQuizStore((state) => state.setStarted);
  const step = useQuizStore((state) => state.step);
  const quizSteps = 6;
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      console.log('Telegram WebApp data:', window.Telegram.WebApp.initDataUnsafe);
    } else {
      console.warn('Telegram WebApp is not available');
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
              <div className="container mx-auto px-4 py-4 max-w-2xl h-screen flex flex-col">
                <header className="flex items-center gap-2 mb-4">
                  <Wallet className="w-8 h-8 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">Быстрые займы</h1>
                </header>

                {started && step < quizSteps && <QuizProgress />}
                
                {!started ? (
                  <div className="grid grid-cols-2 gap-4 flex-1">
                    <div className="col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                      <div className="flex items-start gap-6">
                        <div className="flex-1">
                          <h2 className="text-2xl font-semibold mb-3">Получите персональное предложение</h2>
                          <p className="text-blue-100 mb-4">Подберем лучшие условия специально для вас</p>
                          <button 
                            onClick={() => setStarted(true)}
                            className="w-full bg-white text-blue-600 rounded-lg py-3 px-4 font-medium hover:bg-blue-50 transition-colors"
                          >
                            Получить предложение
                          </button>
                        </div>
                        <div className="bg-blue-500/20 p-4 rounded-lg">
                          <Wallet className="w-16 h-16 text-white" strokeWidth={1.5} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-5 text-white">
                      <h2 className="font-semibold mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Надежные банки
                      </h2>
                      <p className="text-sm text-emerald-100">Сотрудничаем только с проверенными организациями</p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-5 text-white">
                      <h2 className="font-semibold mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Быстрое одобрение
                      </h2>
                      <p className="text-sm text-amber-100">Решение по займу за 5-15 минут</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-5 text-white">
                      <h2 className="font-semibold mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Первый займ 0%
                      </h2>
                      <p className="text-sm text-purple-100">У большинства партнеров первый займ бесплатно</p>
                    </div>

                    <div className="bg-gradient-to-br from-rose-600 to-rose-700 rounded-xl p-5 text-white">
                      <h2 className="font-semibold mb-3 flex items-center gap-2">
                        <BadgeCheck className="w-5 h-5" />
                        Высокий % одобрения
                      </h2>
                      <p className="text-sm text-rose-100">Подбираем предложения с максимальной вероятностью</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Quiz />
                    {step >= quizSteps && (
                      <div className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                          <h2 className="text-xl font-semibold mb-2">Поздравляем! 🎉</h2>
                          <p className="opacity-90">
                            Мы подобрали для вас лучшие предложения от надежных банков. 
                            Выберите подходящий вариант и получите деньги уже сегодня!
                          </p>
                        </div>
                        <RecentLoans />
                        <LoanOffers />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;