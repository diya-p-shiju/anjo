import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  vendorId: string;
  onOrderSuccess: () => void;
}

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  calories: string;
}

interface UserData {
  credits: number;
  name: string;
  email: string;
  mobileNumber: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  vendorId,
  onOrderSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  const baseUrl = 'http://localhost:3000';
  const userId = localStorage.getItem('_id') || '';

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Fetch fresh user data
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/user/${userId}`);
      
      if (response.data.status === 'success') {
        const { credits, name, email, mobileNumber } = response.data.data;
        setUserData({ credits, name, email, mobileNumber });
        setError(null);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data. Please try again.');
    }
  };

  // Fetch user data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  if (!isOpen || !userData) return null;

  const handleCheckout = async () => {
    if (!userData.name || !userData.email || !userData.mobileNumber) {
      setError('Missing user information. Please log in again.');
      return;
    }

    if (userData.credits < totalAmount) {
      setError('Insufficient credits. Please recharge your account.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const menuItems = cartItems.map(item => ({
        menuItemId: item._id,
        calories: item.calories || "N/A",
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity
      }));

      const orderData = {
        userId,
        vendorId,
        menuItems,
        totalAmount,
        deliveryTime: new Date(Date.now() + 30 * 60000),
        name: userData.name,
        email: userData.email,
        mobileNumber: userData.mobileNumber,
        status: 'pending',
        paymentStatus: 'paid'
      };

      console.log('Sending order data:', JSON.stringify(orderData, null, 2));

      const response = await axios.post(`${baseUrl}/order`, orderData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.status === 'success') {
        // Fetch fresh user data after successful order
        await fetchUserData();
        onOrderSuccess();
        onClose();
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
    } catch (err: any) {
      console.error('Order error:', err.response || err);
      setError(err.response?.data?.message || err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRechargeClick = () => {
    alert('Please navigate to the recharge page to add more credits.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Confirm Order</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Order Summary</h3>
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Your Credits:</span>
                <span className={`font-medium ${userData.credits < totalAmount ? 'text-red-600' : 'text-green-600'}`}>
                  ₹{userData.credits.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              {userData.credits < totalAmount && (
                <div className="mt-2">
                  <h1
                    
                    className="w-full py-2 text-red-700 rounded-lg font-medium  transition-colors"
                    
                  >
                    Please Recharge Credits
                 </h1>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t">
          <button
            onClick={handleCheckout}
            disabled={isLoading || userData.credits < totalAmount}
            className={`w-full py-3 text-white rounded-lg font-medium transition-colors 
              ${isLoading || userData.credits < totalAmount 
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700'}`}
          >
            {isLoading ? 'Processing...' : 'Confirm Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;