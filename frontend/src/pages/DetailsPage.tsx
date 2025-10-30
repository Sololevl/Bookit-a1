import React, { useState, useEffect } from 'react';
import { Experience, CheckoutData, Slot } from '../types';
import { experienceApi } from '../services/api';
import { groupSlotsByDate, GroupedSlot } from '../utils/helpers';

interface DetailsPageProps {
  experienceId: string;
  setPage: (page: 'home' | 'checkout') => void;
  setCheckoutData: (data: CheckoutData) => void;
}

const DetailsPage: React.FC<DetailsPageProps> = ({ experienceId, setPage, setCheckoutData }) => {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [groupedSlots, setGroupedSlots] = useState<GroupedSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeId, setSelectedTimeId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const TAXES = 59;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await experienceApi.getById(experienceId);
        setExperience(data);

        if (data.slots && data.slots.length > 0) {
          const grouped = groupSlotsByDate(data.slots);
          setGroupedSlots(grouped);

          setSelectedDate(grouped[0].dateLabel);
          const firstAvailable = grouped[0].times.find(t => !t.soldOut);
          if (firstAvailable) {
            setSelectedTimeId(firstAvailable.id);
          }
        }
      } catch (err) {
        setError('Failed to load experience details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [experienceId]);

  const handleConfirm = () => {
    if (!experience || !selectedTimeId) return;

    const selectedSlot = experience.slots?.find(s => s.id === selectedTimeId);
    if (!selectedSlot) return;

    const subtotal = experience.price * quantity;
    const total = subtotal + TAXES;

    setCheckoutData({
      experience: {
        id: experience.id,
        title: experience.title,
        price: experience.price,
      },
      slot: selectedSlot,
      quantity,
      subtotal,
      taxes: TAXES,
      total,
    });
    setPage('checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading details...</p>
        </div>
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">{error || 'Experience not found'}</p>
      </div>
    );
  }

  const currentTimes = groupedSlots.find(g => g.dateLabel === selectedDate)?.times || [];
  const subtotal = experience.price * quantity;
  const total = subtotal + TAXES;

  return (
    <div>
      <button
        onClick={() => setPage('home')}
        className="flex items-center text-gray-700 hover:text-black mb-6 font-medium"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Details
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <img
            src={experience.imageUrl}
            alt={experience.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
          />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{experience.title}</h1>
          <p className="text-gray-600 mb-8">{experience.description}</p>

          {groupedSlots.length > 0 && (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Choose date</h3>
                <div className="flex flex-wrap gap-2">
                  {groupedSlots.map((group) => (
                    <button
                      key={group.dateKey}
                      onClick={() => {
                        setSelectedDate(group.dateLabel);
                        const firstAvailable = group.times.find(t => !t.soldOut);
                        setSelectedTimeId(firstAvailable ? firstAvailable.id : null);
                      }}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                        selectedDate === group.dateLabel
                          ? 'bg-yellow-400 text-black'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {group.dateLabel}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Choose time</h3>
                <div className="flex flex-wrap gap-2">
                  {currentTimes.map((time) => (
                    <button
                      key={time.id}
                      onClick={() => !time.soldOut && setSelectedTimeId(time.id)}
                      disabled={time.soldOut}
                      className={`px-4 py-2 rounded-md text-sm font-medium relative transition ${
                        selectedTimeId === time.id
                          ? 'bg-yellow-400 text-black'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${time.soldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {time.timeLabel}
                      {time.soldOut ? (
                        <span className="absolute -top-2 -right-2 bg-gray-300 text-gray-600 text-xs px-2 py-0.5 rounded">
                          Sold out
                        </span>
                      ) : (
                        <span className={`absolute -top-2 -right-2 text-xs px-2 py-0.5 rounded ${
                          time.left <= 2 ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {time.left} left
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-6 h-fit sticky top-24">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Starts at</span>
              <span className="font-semibold text-gray-900">₹{experience.price}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Quantity</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">₹{subtotal}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taxes</span>
              <span className="font-semibold text-gray-900">₹{TAXES}</span>
            </div>

            <hr className="border-gray-300" />

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">₹{total}</span>
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedTimeId}
              className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-md transition"
            >
              {selectedTimeId ? 'Confirm' : 'Select a time'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;