import React, { useEffect, useState } from 'react';
import { XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="w-20 h-20 text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your payment has been cancelled. No charges have been made to your account.
        </p>
        
        <div className="text-sm text-gray-500">
          Redirecting to home in {countdown} seconds...
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-6 w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentCancel;