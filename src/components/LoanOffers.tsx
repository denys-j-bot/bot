import React, { useEffect, useState } from 'react';
import { useQuizStore } from '../store/quiz';
import { Shield, Percent, Clock, BadgeCheck, ExternalLink, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoanOffer {
  id: string;
  name: string;
  url: string;
  country: string;
  logo_url: string | null;
  min_amount: number;
  max_amount: number;
  rate: string;
  term: string;
  approval_time: string;
  first_loan_free: boolean;
  is_active: boolean;
  display_order: number;
  max_term_days: number;
  approval_rating: 'high' | 'medium' | 'low';
}

const currencySymbols = {
  ua: '₴',
  kz: '₸',
  ru: '₽',
};

const approvalRatingLabels = {
  high: 'Высокая вероятность',
  medium: 'Средняя вероятность',
  low: 'Низкая вероятность',
};

const approvalRatingColors = {
  high: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-red-100 text-red-700',
};

export function LoanOffers() {
  const country = useQuizStore((state) => state.country);
  const step = useQuizStore((state) => state.step);
  const quizSteps = 6;
  const [offers, setOffers] = useState<LoanOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (step >= quizSteps && country) {
      loadOffers();
    }
  }, [step, country]);

  async function loadOffers() {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('loan_offers')
        .select('*')
        .eq('country', country)
        .eq('is_active', true)
        .order('display_order');

      if (error) {
        throw error;
      }

      setOffers(data || []);
    } catch (err) {
      console.error('Error loading offers:', err);
      setError('Не удалось загрузить предложения. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  }

  if (step < quizSteps || !country) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-blue-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-blue-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
        <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
        <p className="text-yellow-700">К сожалению, сейчас нет доступных предложений. Пожалуйста, попробуйте позже.</p>
      </div>
    );
  }

  const currencySymbol = currencySymbols[country] || '';

  const handleOfferClick = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="grid gap-4">
      {offers.map((offer) => (
        <div
          key={offer.id}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {offer.logo_url ? (
                <img 
                  src={offer.logo_url} 
                  alt={offer.name} 
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <Shield className="w-8 h-8 text-blue-600" />
              )}
              <h3 className="text-lg font-semibold">{offer.name}</h3>
            </div>
            <div className="flex gap-2">
              {offer.first_loan_free && (
                <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded">
                  Первый займ под 0%
                </span>
              )}
              <span className={`text-xs font-medium px-2.5 py-1 rounded ${approvalRatingColors[offer.approval_rating]}`}>
                {approvalRatingLabels[offer.approval_rating]}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium">Сумма</div>
                <div className="text-sm text-gray-600">
                  {offer.min_amount.toLocaleString()} - {offer.max_amount.toLocaleString()} {currencySymbol}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium">Ставка</div>
                <div className="text-sm text-gray-600">{offer.rate} в день</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium">Срок</div>
                <div className="text-sm text-gray-600">
                  {offer.term} (до {offer.max_term_days} дней)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-sm font-medium">Одобрение</div>
                <div className="text-sm text-gray-600">за {offer.approval_time}</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleOfferClick(offer.url)}
            className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            Получить деньги
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}