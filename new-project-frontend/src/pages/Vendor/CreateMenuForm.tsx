import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus } from 'lucide-react';

const MenuForm = () => {
  const [items, setItems] = useState([{
    name: '',
    price: '',
    description: '',
    available: true,
    calories: '',
    maxOrderQuantity: 10,
    orderQuantity: 0
  }]);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchExistingMenu = async () => {
      try {
        const currentUserId = localStorage.getItem('_id');
        if (!currentUserId) {
          setStatus({
            type: 'error',
            message: 'User ID not found. Please login again.'
          });
          setIsFetching(false);
          return;
        }
  
        const response = await axios.get(`http://localhost:3000/menu?vendorId=${currentUserId}`);
        
        if (response.data?.data && response.data.data.length > 0) {
          const menu = response.data.data[0];
          setItems(menu.items.map(item => ({
            ...item,
            price: item.price.toString(),
            available: item.available || false,
            calories: item.calories || '',
            maxOrderQuantity: item.maxOrderQuantity || 10,
            orderQuantity: item.orderQuantity || 0
          })));
        }
      } catch (error) {
        if (error.response?.status !== 404) {
          setStatus({
            type: 'error',
            message: 'Error fetching menu data'
          });
        }
      } finally {
        setIsFetching(false);
      }
    };
  
    fetchExistingMenu();
  }, []);

  const addItem = () => {
    setItems([...items, {
      name: '',
      price: '',
      description: '',
      available: true,
      calories: '',
      maxOrderQuantity: 10,
      orderQuantity: 0
    }]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const validateForm = () => {
    if (items.length === 0) {
      setStatus({ type: 'error', message: 'At least one menu item is required' });
      return false;
    }

    for (const item of items) {
      if (!item.name.trim() || !item.price.trim() || !item.description.trim() || !item.calories.trim()) {
        setStatus({ type: 'error', message: 'All fields except Order Quantity are required' });
        return false;
      }
      
      const price = parseFloat(item.price);
      if (isNaN(price) || price <= 0) {
        setStatus({ type: 'error', message: 'Price must be a valid positive number' });
        return false;
      }

      const maxOrderQty = parseInt(item.maxOrderQuantity);
      if (isNaN(maxOrderQty) || maxOrderQty <= 0) {
        setStatus({ type: 'error', message: 'Maximum order quantity must be a positive number' });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const currentUserId = localStorage.getItem('_id');
    if (!currentUserId) {
      setStatus({
        type: 'error',
        message: 'User ID not found. Please login again.'
      });
      return;
    }

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const formattedItems = items.map(item => ({
        ...item,
        price: parseFloat(item.price),
        maxOrderQuantity: parseInt(item.maxOrderQuantity),
        orderQuantity: parseInt(item.orderQuantity)
      }));

      const response = await axios.post('http://localhost:3000/menu', {
        vendorId: currentUserId,
        items: formattedItems
      });

      if (response.data.status === 'success') {
        setStatus({
          type: 'success',
          message: 'Menu updated successfully!'
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Error updating menu'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-teal-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-gray-600">Loading menu data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto">
        <div className="bg-white rounded-t-xl shadow-sm border-b">
          <div className="px-4 py-5 sm:px-6 md:px-8 flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Menu Management</h2>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center px-3 py-2 text-sm bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              <Plus size={16} className="mr-1" />
              <span className="hidden sm:inline">Add Item</span>
            </button>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-b-xl">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="p-4 sm:p-6 border-2 border-gray-200 rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-700">Item {index + 1}</h4>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Item Name
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Enter item name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Price
                      </label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(index, 'price', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Enter price"
                        step="0.01"
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Calories
                      </label>
                      <input
                        type="text"
                        value={item.calories}
                        onChange={(e) => updateItem(index, 'calories', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Enter calories"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Max Order Quantity
                      </label>
                      <input
                        type="number"
                        value={item.maxOrderQuantity}
                        onChange={(e) => updateItem(index, 'maxOrderQuantity', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Enter max order quantity"
                        min="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Current Order Quantity
                      </label>
                      <input
                        type="number"
                        value={item.orderQuantity}
                        onChange={(e) => updateItem(index, 'orderQuantity', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Enter current order quantity"
                        min="0"
                        readOnly
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Availability
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={item.available}
                          onChange={(e) => updateItem(index, 'available', e.target.checked)}
                          className="w-4 h-4 text-teal-500 border-2 border-gray-200 rounded focus:ring-2 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          {item.available ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                    </div>

                    <div className="sm:col-span-2 space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Enter item description"
                        rows="2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {status.message && (
              <div className={`p-4 rounded-lg ${
                status.type === 'error' 
                  ? 'bg-red-50 border-2 border-red-200 text-red-700' 
                  : 'bg-green-50 border-2 border-green-200 text-green-700'
              }`}>
                {status.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 text-white rounded-lg transition-colors ${
                isLoading 
                  ? 'bg-teal-300 cursor-not-allowed' 
                  : 'bg-teal-500 hover:bg-teal-600'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Update Menu'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MenuForm;