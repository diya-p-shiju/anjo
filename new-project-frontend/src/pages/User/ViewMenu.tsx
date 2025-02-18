import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import CheckoutModal from './CheckoutModal';
import salad from '../../assets/salad.webp';

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  calories: string;
  description: string;
  availability: boolean;
  orderQuantity: number;
  maxOrderQuantity: number;
}

interface MenuVendor {
  _id: string;
  vendorId: string;
  items: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

// Cart Component
const Cart: React.FC<{
  cartItems: CartItem[];
  updateQuantity: (item: MenuItem, delta: number) => void;
  onCheckout: () => void;
}> = ({ cartItems, updateQuantity, onCheckout }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="w-96 bg-white rounded-lg shadow-lg p-6 h-[calc(100vh-2rem)] sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Your Cart</h2>
        <ShoppingCart className="w-6 h-6" />
      </div>
      
      <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-600">Rs. {item.price}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(item, -1)}
                className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item, 1)}
                disabled={item.quantity >= item.maxOrderQuantity}
                className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Total:</span>
          <span className="font-bold">Rs. {total.toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          className="w-full py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

// Menu Cards Component
const MenuCards = () => {
  const [menuVendors, setMenuVendors] = useState<MenuVendor[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/menu');
      if (response.data.status === "success") {
        setMenuVendors(response.data.data);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch menu items');
      console.error('Error fetching menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateCart = (item: MenuItem, delta: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem._id === item._id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + delta;
        if (newQuantity <= 0) {
          return prevItems.filter(cartItem => cartItem._id !== item._id);
        }
        if (newQuantity > item.maxOrderQuantity) {
          return prevItems;
        }
        return prevItems.map(cartItem =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );
      }
      
      if (delta > 0) {
        return [...prevItems, { ...item, quantity: 1 }];
      }
      
      return prevItems;
    });
  };

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    setIsCheckoutModalOpen(true);
  };

  const handleOrderSuccess = () => {
    setCartItems([]); // Clear cart after successful checkout
  };

  if (loading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 bg-red-50 text-red-800 rounded-lg">
        {error}
      </div>
    );
  }

  // Flatten all items from all vendors into a single array
  const allItems = menuVendors.flatMap(vendor => vendor.items);

  return (
    <div className="flex gap-8 p-6">
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allItems.map((item) => (
            <div
              key={item._id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${!item.availability ? 'opacity-50' : ''}`}
            >
              <div className="h-40 bg-gray-200">
                <img
                  src={salad}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <span className="text-lg font-semibold text-teal-600">
                    Rs. {item.price}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-2 py-1 text-sm rounded bg-gray-100 text-gray-800">
                    {item.calories} cal
                  </span>
                  <span className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-800">
                    Max order: {item.maxOrderQuantity}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => updateCart(item, 1)}
                    disabled={!item.availability || cartItems.find(cartItem => cartItem._id === item._id)?.quantity >= item.maxOrderQuantity}
                    className="w-full px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {item.availability ? 'Add to Cart' : 'Not Available'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Cart
        cartItems={cartItems}
        updateQuantity={updateCart}
        onCheckout={handleCheckout}
      />
      
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cartItems={cartItems}
        vendorId={menuVendors[0]?.vendorId || ''} // Assuming all items are from the same vendor
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
};

export default MenuCards;