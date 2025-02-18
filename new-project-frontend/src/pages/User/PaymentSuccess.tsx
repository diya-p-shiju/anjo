import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

interface UserDetails {
  credits: number;
}

const PaymentResult = () => {
  const navigate = useNavigate();
  const { status } = useParams();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(10);
  const [isUpdating, setIsUpdating] = useState(true);

  const isSuccess = status === 'success';
  const sessionId = searchParams.get('session_id');
  const userId = localStorage.getItem('_id');
  const amount = Number(localStorage.getItem('stripeAmount')) || 0;

  const updateUserCredits = async () => {
    try {
      // First, get current user data
      const userResponse = await axios.get(`http://localhost:3000/user/${userId}`);
      
      if (userResponse.data.status === 'success') {
        const currentCredits = userResponse.data.data.credits || 0;
        const newCredits = currentCredits + amount;

        // Update user's credits
        const updateResponse = await axios.put(`http://localhost:3000/user/${userId}`, {
          credits: newCredits
        });

        if (updateResponse.data.status === 'success') {
          // Update credits in localStorage
          localStorage.setItem('credits', newCredits.toString());
          console.log('Credits updated successfully:', newCredits);
        }
      }
    } catch (error) {
      console.error('Error updating credits:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    if (isSuccess && sessionId && amount > 0) {
      updateUserCredits();
    } else {
      setIsUpdating(false);
    }

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
  }, [navigate, isSuccess, sessionId, amount]);

  if (isUpdating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Updating your credits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          {isSuccess ? (
            <CheckCircle className="w-20 h-20 text-teal-500" />
          ) : (
            <XCircle className="w-20 h-20 text-red-500" />
          )}
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {isSuccess ? 'Payment Successful!' : 'Payment Cancelled'}
        </h1>
        
        <p className="text-gray-600 mb-6">
          {isSuccess 
            ? `₹${amount.toFixed(2)} has been added to your account successfully.`
            : 'Your payment has been cancelled. No charges have been made to your account.'}
        </p>
        
        <div className="text-sm text-gray-500">
          Redirecting to home in {countdown} seconds...
        </div>

        <button
          onClick={() => navigate('/')}
          className={`mt-6 w-full py-2 text-white rounded-lg transition-colors
            ${isSuccess 
              ? 'bg-teal-600 hover:bg-teal-700' 
              : 'bg-red-600 hover:bg-red-700'}`}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentResult;