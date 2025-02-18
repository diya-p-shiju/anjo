import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const API_URL = 'http://localhost:3000/api';

const stripePromise = loadStripe('pk_test_51P52w8SBNPGsIMEIv4ie7KUKYcks2x2aMBkBFccm6cUIDBPlQ7NcdkF5lGKGEZLWPM9Vie6q1WPHXvUr5mCb6b2Q00EJFEaOs5');

const PaymentFormContent = () => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const presetAmounts = [500, 1000, 2500];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);

    try {
      const userId = localStorage.getItem('_id');
      if (!userId) {
        throw new Error('User not logged in');
      }

      // Store the amount in localStorage for the success page
      // Convert to rupees since we're sending paisa to the API
      localStorage.setItem('stripeAmount', amount.toString());

      const body = {
        amount: amount * 100, // Convert to paisa
        userId
      };

      const response = await fetch(`${API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const session = await response.json();

      if (!stripe) {
        throw new Error("Stripe has not loaded yet.");
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

    } catch (error) {
      console.error('Payment error:', error);
      alert(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm">
      {/* Header Section */}
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Add Credits</h2>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Preset Amounts */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset)}
              className={`p-4 rounded-lg border-2 transition-all ${
                amount === preset 
                  ? 'border-teal-500 bg-teal-50' 
                  : 'border-gray-200 hover:border-teal-200'
              }`}
            >
              <div className="text-sm text-gray-600 mb-1">Quick Add</div>
              <div className="text-xl font-semibold text-gray-800">₹{preset.toLocaleString()}</div>
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="1"
              className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Enter amount"
            />
          </div>
          {amount > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              You will receive ₹{amount.toLocaleString()} in credits
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || loading || amount <= 0}
          onClick={handleSubmit}
          className="w-full bg-teal-500 text-white py-3 px-4 rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            `Add ₹${amount.toLocaleString()} Credits`
          )}
        </button>
      </div>
    </div>
  );
};

const PaymentForm = () => (
  <Elements stripe={stripePromise}>
    <PaymentFormContent />
  </Elements>
);

export default PaymentForm;