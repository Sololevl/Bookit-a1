import React, { useState, useMemo } from 'react';
import { CheckoutData, PromoCode } from '../types';
import { bookingApi, promoApi } from '../services/api';
import { formatDate, formatTime } from '../utils/helpers';

interface CheckoutPageProps {
  checkoutData: CheckoutData;
  setPage: (page: 'details' | 'confirmation') => void;
  setConfirmationData: (data: { refId: string }) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ checkoutData, setPage, setConfirmationData }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const { experience, slot, quantity, subtotal, taxes } = checkoutData;

    const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    
    let calculatedDiscount = 0;
    
    if (appliedPromo.discountType === 'percentage') {
        calculatedDiscount = (subtotal * appliedPromo.value) / 100;
    } else {
        calculatedDiscount = appliedPromo.value;
    }
    
    // Ensure discount doesn't exceed subtotal
    return Math.min(calculatedDiscount, subtotal);
    }, [appliedPromo, subtotal]);
  const total = Math.max(taxes, subtotal + taxes - discount); 

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    try {
      setPromoLoading(true);
      setPromoError('');
      setPromoSuccess('');

      const response = await promoApi.validate(promoCode);

      if (response.success && response.data) {
        setAppliedPromo(response.data);
        setPromoSuccess(`Promo code "${response.data.code}" applied!`);
      } else {
        setAppliedPromo(null);
        setPromoError(response.message || 'Invalid promo code');
      }
    } catch (err: any) {
      setAppliedPromo(null);
      setPromoError(err.response?.data?.message || 'Invalid promo code');
    } finally {
      setPromoLoading(false);
    }
  };

  const handlePayAndConfirm = async () => {
    setError('');

    if (!fullName.trim() || !email.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (!agreed) {
      setError('Please agree to the terms and safety policy');
      return;
    }

    try {
      setLoading(true);

      const response = await bookingApi.create({
        slotId: slot.id,
        quantity,
        user: {
          name: fullName,
          email: email,
        },
        total,
        promoCode: appliedPromo?.code,
      });

      if (response.success) {
        setConfirmationData({ refId: response.data.refId });
        setPage('confirmation');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setPage('details')}
        className="flex items-center text-gray-700 hover:text-black mb-6 font-medium"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Checkout
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2 bg-gray-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-4 py-2 bg-gray-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Promo code"
                className="flex-1 px-4 py-2 bg-gray-200 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                onClick={handleApplyPromo}
                disabled={promoLoading}
                className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold px-6 py-2 rounded-md transition"
              >
                {promoLoading ? '...' : 'Apply'}
              </button>
            </div>
            {promoError && <p className="text-red-600 text-sm mt-1">{promoError}</p>}
            {promoSuccess && <p className="text-green-600 text-sm mt-1">{promoSuccess}</p>}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
              I agree to the terms and safety policy
            </label>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 h-fit sticky top-24">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Experience</span>
              <span className="font-semibold text-gray-900">{experience.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-semibold text-gray-900">
                {formatDate(new Date(slot.startTime))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time</span>
              <span className="font-semibold text-gray-900">
                {formatTime(new Date(slot.startTime))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Qty</span>
              <span className="font-semibold text-gray-900">{quantity}</span>
            </div>
          </div>

          <hr className="border-gray-300 my-4" />

          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxes</span>
              <span className="font-semibold text-gray-900">₹{taxes}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span className="font-medium">Discount ({appliedPromo?.code})</span>
                <span className="font-semibold">-₹{discount.toFixed(2)}</span>
              </div>
            )}
          </div>

          <hr className="border-gray-300 my-4" />

          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-gray-900">₹{total.toFixed(2)}</span>
          </div>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <button
            onClick={handlePayAndConfirm}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-md transition"
          >
            {loading ? 'Processing...' : 'Pay and Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;