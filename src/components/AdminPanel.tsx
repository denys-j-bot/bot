import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, Percent, Clock, BadgeCheck, Plus, Trash2, Save, Upload, AlertTriangle, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

const countries = [
  { value: 'ua', label: 'Украина' },
  { value: 'kz', label: 'Казахстан' },
  { value: 'ru', label: 'Россия' },
];

const approvalRatings = [
  { value: 'high', label: 'Высокое' },
  { value: 'medium', label: 'Среднее' },
  { value: 'low', label: 'Низкое' },
];

const defaultOffer: Partial<LoanOffer> = {
  min_amount: 1000,
  max_amount: 15000,
  rate: '0.01',
  term: '7-30 дней',
  approval_time: '15 минут',
  first_loan_free: false,
  is_active: true,
  max_term_days: 30,
  approval_rating: 'medium',
  country: 'ua',
  name: '',
  url: '',
};

export function AdminPanel() {
  const [offers, setOffers] = useState<LoanOffer[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('ua');
  const [editingOffer, setEditingOffer] = useState<LoanOffer | null>(null);
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOffers();
  }, [selectedCountry]);

  async function loadOffers() {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('loan_offers')
        .select('*')
        .eq('country', selectedCountry)
        .order('display_order');

      if (error) throw error;
      setOffers(data || []);
    } catch (err) {
      console.error('Error loading offers:', err);
      setError('Ошибка при загрузке предложений');
    }
  }

  async function handleSaveOffer(offer: Partial<LoanOffer>) {
    try {
      setError(null);
      const { error } = await supabase
        .from('loan_offers')
        .upsert({
          ...offer,
          country: selectedCountry,
          min_amount: Number(offer.min_amount),
          max_amount: Number(offer.max_amount),
          max_term_days: Number(offer.max_term_days),
        });

      if (error) throw error;

      await loadOffers();
      setEditingOffer(null);
      setIsAddingOffer(false);
    } catch (err) {
      console.error('Error saving offer:', err);
      setError('Ошибка при сохранении предложения');
    }
  }

  async function handleDeleteOffer(id: string) {
    try {
      setError(null);
      const { error } = await supabase
        .from('loan_offers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadOffers();
    } catch (err) {
      console.error('Error deleting offer:', err);
      setError('Ошибка при удалении предложения');
    }
  }

  async function handleLogoUpload(event: React.ChangeEvent<HTMLInputElement>, offerId: string) {
    try {
      setError(null);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${offerId}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('loan_offers')
        .update({ logo_url: publicUrl })
        .eq('id', offerId);

      if (updateError) throw updateError;

      await loadOffers();
    } catch (err) {
      console.error('Error uploading logo:', err);
      setError('Ошибка при загрузке логотипа');
    }
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    try {
      setError(null);
      const items = Array.from(offers);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      const updates = items.map((item, index) => ({
        id: item.id,
        display_order: index,
      }));

      const { error } = await supabase
        .from('loan_offers')
        .upsert(updates);

      if (error) throw error;

      setOffers(items);
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Ошибка при изменении порядка');
    }
  };

  const handleAddOffer = () => {
    setIsAddingOffer(true);
    setEditingOffer({
      ...defaultOffer,
      country: selectedCountry,
      display_order: offers.length,
    } as LoanOffer);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Панель администратора</h1>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Выберите страну
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {countries.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
          </div>

          {/* Offers Management */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Предложения</h2>
              <button
                onClick={handleAddOffer}
                className="bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Добавить предложение
              </button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="offers-list">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {isAddingOffer && (
                      <div className="border rounded-lg p-4 bg-white">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Название банка
                            </label>
                            <input
                              type="text"
                              value={editingOffer?.name || ''}
                              onChange={(e) => setEditingOffer({
                                ...editingOffer,
                                name: e.target.value
                              } as LoanOffer)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              URL сайта
                            </label>
                            <input
                              type="text"
                              value={editingOffer?.url || ''}
                              onChange={(e) => setEditingOffer({
                                ...editingOffer,
                                url: e.target.value
                              } as LoanOffer)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Минимальная сумма
                            </label>
                            <input
                              type="number"
                              value={editingOffer?.min_amount || ''}
                              onChange={(e) => setEditingOffer({
                                ...editingOffer,
                                min_amount: parseInt(e.target.value)
                              } as LoanOffer)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Максимальная сумма
                            </label>
                            <input
                              type="number"
                              value={editingOffer?.max_amount || ''}
                              onChange={(e) => setEditingOffer({
                                ...editingOffer,
                                max_amount: parseInt(e.target.value)
                              } as LoanOffer)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Ставка
                            </label>
                            <input
                              type="text"
                              value={editingOffer?.rate || ''}
                              onChange={(e) => setEditingOffer({
                                ...editingOffer,
                                rate: e.target.value
                              } as LoanOffer)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Срок
                            </label>
                            <input
                              type="text"
                              value={editingOffer?.term || ''}
                              onChange={(e) => setEditingOffer({
                                ...editingOffer,
                                term: e.target.value
                              } as LoanOffer)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Максимальный срок (дни)
                            </label>
                            <input
                              type="number"
                              value={editingOffer?.max_term_days || ''}
                              onChange={(e) => setEditingOffer({
                                ...editingOffer,
                                max_term_days: parseInt(e.target.value)
                              } as LoanOffer)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Время одобрения
                            </label>
                            <input
                              type="text"
                              value={editingOffer?.approval_time || ''}
                              onChange={(e) => setEditingOffer({
                                ...editingOffer,
                                approval_time: e.target.value
                              } as LoanOffer)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Вероятность одобрения
                            </label>
                            <select
                              value={editingOffer?.approval_rating || 'medium'}
                              onChange={(e) => setEditingOffer({
                                ...editingOffer,
                                approval_rating: e.target.value as 'high' | 'medium' | 'low'
                              } as LoanOffer)}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                              {approvalRatings.map((rating) => (
                                <option key={rating.value} value={rating.value}>
                                  {rating.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingOffer?.first_loan_free || false}
                                onChange={(e) => setEditingOffer({
                                  ...editingOffer,
                                  first_loan_free: e.target.checked
                                } as LoanOffer)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Первый займ бесплатно
                              </span>
                            </label>
                          </div>
                          <div className="flex items-center">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={editingOffer?.is_active || false}
                                onChange={(e) => setEditingOffer({
                                  ...editingOffer,
                                  is_active: e.target.checked
                                } as LoanOffer)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Активно
                              </span>
                            </label>
                          </div>
                          <div className="col-span-2">
                            <button
                              onClick={() => handleSaveOffer(editingOffer as LoanOffer)}
                              className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 font-medium hover:bg-blue-700 transition-colors"
                            >
                              Сохранить
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {offers.map((offer, index) => (
                      <Draggable key={offer.id} draggableId={offer.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`border rounded-lg p-4 bg-white ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-move p-1 hover:bg-gray-100 rounded"
                                >
                                  <GripVertical className="w-5 h-5 text-gray-400" />
                                </div>
                                {offer.logo_url ? (
                                  <img 
                                    src={offer.logo_url} 
                                    alt={offer.name} 
                                    className="w-8 h-8 object-contain"
                                  />
                                ) : (
                                  <Shield className="w-8 h-8 text-blue-600" />
                                )}
                                <h3 className="text-lg font-semibold">
                                  {offer.name}
                                </h3>
                              </div>
                              <div className="flex gap-2">
                                <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 rounded-lg p-2 transition-colors">
                                  <Upload className="w-5 h-5 text-gray-600" />
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleLogoUpload(e, offer.id)}
                                  />
                                </label>
                                <button
                                  onClick={() => setEditingOffer(offer)}
                                  className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                  <Save className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteOffer(offer.id)}
                                  className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>

                            {editingOffer?.id === offer.id ? (
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Название банка
                                  </label>
                                  <input
                                    type="text"
                                    value={editingOffer.name}
                                    onChange={(e) => setEditingOffer({
                                      ...editingOffer,
                                      name: e.target.value
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL сайта
                                  </label>
                                  <input
                                    type="text"
                                    value={editingOffer.url}
                                    onChange={(e) => setEditingOffer({
                                      ...editingOffer,
                                      url: e.target.value
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Минимальная сумма
                                  </label>
                                  <input
                                    type="number"
                                    value={editingOffer.min_amount}
                                    onChange={(e) => setEditingOffer({
                                      ...editingOffer,
                                      min_amount: parseInt(e.target.value)
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Максимальная сумма
                                  </label>
                                  <input
                                    type="number"
                                    value={editingOffer.max_amount}
                                    onChange={(e) => setEditingOffer({
                                      ...editingOffer,
                                      max_amount: parseInt(e.target.value)
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ставка
                                  </label>
                                  <input
                                    type="text"
                                    value={editingOffer.rate}
                                    onChange={(e) => setEditingOffer({
                                      ...editingOffer,
                                      rate: e.target.value
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Срок
                                  </label>
                                  <input
                                    type="text"
                                    value={editingOffer.term}
                                    onChange={(e) => setEditingOffer({
                                      ...editingOffer,
                                      term: e.target.value
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Максимальный срок (дни)
                                  </label>
                                  <input
                                    type="number"
                                    value={editingOffer.max_term_days}
                                    onChange={(e) => setEditingOffer({
                                      ...editingOffer,
                                      max_term_days: parseInt(e.target.value)
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Время одобрения
                                  </label>
                                  <input
                                    type="text"
                                    value={editingOffer.approval_time}
                                    onChange={(e) => setEditingOffer({
                                      ...editingOffer,
                                      approval_time: e.target.value
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Вероятность одобрения
                                  </label>
                                  <select
                                    value={editingOffer.approval_rating}
                                    onChange={(e) => setEditingOffer({
                                      ...editingOffer,
                                      approval_rating: e.target.value as 'high' | 'medium' | 'low'
                                    })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                  >
                                    {approvalRatings.map((rating) => (
                                      <option key={rating.value} value={rating.value}>
                                        {rating.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div className="flex items-center">
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={editingOffer.first_loan_free}
                                      onChange={(e) => setEditingOffer({
                                        ...editingOffer,
                                        first_loan_free: e.target.checked
                                      })}
                                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                      Первый займ бесплатно
                                    </span>
                                  </label>
                                </div>
                                <div className="flex items-center">
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={editingOffer.is_active}
                                      onChange={(e) => setEditingOffer({
                                        ...editingOffer,
                                        is_active: e.target.checked
                                      })}
                                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                      Активно
                                    </span>
                                  </label>
                                </div>
                                <div className="col-span-2">
                                  <button
                                    onClick={() => handleSaveOffer(editingOffer)}
                                    className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 font-medium hover:bg-blue-700 transition-colors"
                                  >
                                    Сохранить
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  <Shield className="w-5 h-5 text-blue-600" />
                                  <div>
                                    <div className="text-sm font-medium">Сумма</div>
                                    <div className="text-sm text-gray-600">
                                      {offer.min_amount.toLocaleString()} - {offer.max_amount.toLocaleString()}
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
                                    <div className="text-sm text-gray-600">
                                      {approvalRatings.find(r => r.value === offer.approval_rating)?.label}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  );
}