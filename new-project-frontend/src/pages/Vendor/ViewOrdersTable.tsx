import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, X, RefreshCcw, Search } from 'lucide-react';
import axios from 'axios';

const OrdersTable = () => {
interface Order {
  _id: string;
  vendorId: string;
  name: string;
  email: string;
  mobileNumber: string;
  orderDate: string;
  status: string;
  paymentStatus: string;
  deliveryTime?: string;
  totalAmount: number;
  menuItems: {
    _id: string;
    name: string;
    calories: number;
    quantity: number;
    totalPrice: number;
  }[];
}

const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState({ show: false, message: '', type: '' });
  const [searchQuery, setSearchQuery] = useState('');
  
  const vendorId = localStorage.getItem('_id');

    console.log('localStorage _id:', localStorage.getItem('_id'));
    console.log('All localStorage items:', {
        _id: localStorage.getItem('_id'),
        name: localStorage.getItem('name'),
        email: localStorage.getItem('email')
    });

  const baseUrl = 'http://localhost:3000';

  useEffect(() => {
    console.log('Current vendorId:', vendorId);
    if (vendorId) {
        fetchOrders();
    } else {
        setError('Vendor not authenticated');
        setLoading(false);
    }
}, [vendorId]);

const fetchOrders = async () => {
  try {
      setLoading(true);
      const storedVendorId = localStorage.getItem('_id');
      console.log('Current logged-in vendor ID:', storedVendorId);

      const response = await axios.get(`${baseUrl}/order`);
      
      if (response.data.status === 'success') {
          const orders = response.data.data;
          
          // Log each order's vendor ID comparison
          orders.forEach(order => {
              console.log('Order comparison:', {
                  orderId: order._id,
                  orderVendorId: order.vendorId,
                  loggedInVendorId: storedVendorId,
                  matches: order.vendorId === storedVendorId,
                  orderTotal: order.totalAmount
              });
          });

          const vendorOrders = orders.filter(order => order.vendorId === storedVendorId);
          console.log(`Found ${vendorOrders.length} orders for vendor ${storedVendorId}`);
          
          setOrders(vendorOrders);
          setError(null);
      }
  } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch orders. Please try again.');
  } finally {
      setLoading(false);
  }
};

  const updateVendorCredits = async (amount) => {
    try {
        const currentCredits = parseInt(localStorage.getItem('credits') || '0');
        const newCredits = currentCredits + amount;

        // Fix the endpoint URL
        const response = await axios.put(`${baseUrl}/user/${vendorId}`, {
            credits: newCredits
        });
        
        if (response.data.status === 'success') {
            localStorage.setItem('credits', newCredits.toString());
            return true;
        }
        return false;
    } catch (err) {
        console.error('Failed to update vendor credits:', err);
        return false;
    }
};

const updateOrder = async (orderId, newStatus, orderAmount) => {
  try {
      console.log('Updating order:', {
          orderId,
          newStatus,
          orderAmount
      });
      
      const response = await axios.put(
          `${baseUrl}/order/${orderId}`,
          { 
              status: newStatus,
              vendorId: vendorId
          }
      );
      
      console.log('Update response:', response.data);

      if (response.data.status === 'success') {
          if (newStatus === 'completed') {
              // If completing the order, add credits to vendor
              const creditUpdateSuccess = await updateVendorCredits(orderAmount);
              if (!creditUpdateSuccess) {
                  throw new Error('Failed to update vendor credits');
              }
          } else if (newStatus === 'cancelled') {
              // If cancelling the order, reduce credits from user
              const order = response.data.data;
              const userCreditUpdateSuccess = await updateUserCredits(order.userId, -orderAmount);
              if (!userCreditUpdateSuccess) {
                  throw new Error('Failed to update user credits');
              }
          }

          setUpdateStatus({
              show: true,
              message: `Order ${newStatus === 'completed' ? 'completed' : 'cancelled'} successfully!`,
              type: 'success'
          });
          
          await fetchOrders();
      } else {
          throw new Error(response.data.message);
      }
  } catch (err) {
      console.error('Update order error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update order. Please try again.';
      setUpdateStatus({
          show: true,
          message: errorMessage,
          type: 'error'
      });
  }
};

// Add new function to update user credits
const updateUserCredits = async (userId: string, amount: number) => {
    try {
        // First get current user credits
        const userResponse = await axios.get(`${baseUrl}/user/${userId}`);
        if (userResponse.data.status !== 'success') {
            throw new Error('Failed to fetch user data');
        }

        const currentCredits = userResponse.data.data.credits || 0;
        const newCredits = currentCredits + amount; // amount will be negative for cancellations

        // Update user credits
        const response = await axios.put(`${baseUrl}/user/${userId}`, {
            credits: newCredits
        });
        
        if (response.data.status === 'success') {
            return true;
        }
        return false;
    } catch (err) {
        console.error('Failed to update user credits:', err);
        return false;
    }
};

  useEffect(() => {
    if (vendorId) {
      fetchOrders();
    } else {
      setError('Vendor not authenticated');
      setLoading(false);
    }
  }, [vendorId]);

  // Rest of the component remains the same...
  
  // Keep all the existing JSX, loading states, error handling, and render logic

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCcw className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  const filteredOrders = orders.filter(order => 
    order.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Orders</h1>
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name or order ID..."
            className="w-full md:w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Status Update Message */}
      {updateStatus.show && (
        <div className={`mb-6 p-4 rounded-lg ${
          updateStatus.type === 'success' ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-700'
        }`}>
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {updateStatus.message}
          </div>
        </div>
      )}

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredOrders.map((order) => (
    <div 
        key={order._id}
        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-200"
    >
        <div className="bg-teal-50 px-6 py-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Order ID</p>
                    <p className="font-medium text-gray-900">#{order._id.slice(-6)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium
                    ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                    ${order.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                    ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                `}>
                    {order.status}
                </span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
                Ordered: {formatDate(order.orderDate)}
            </div>
        </div>
        
        <div className="p-6 space-y-4">
            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Customer</p>
                <p className="font-medium text-gray-900">{order.name}</p>
                <p className="text-sm text-gray-600">{order.email}</p>
                <p className="text-sm text-gray-600">{order.mobileNumber}</p>
            </div>

            <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Items</p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                    {order.menuItems.map((item) => (
                        <div key={item._id} className="flex justify-between items-center text-sm">
                            <div className="flex-1">
                                <span className="text-gray-800">{item.name}</span>
                                <div className="text-xs text-gray-500">
                                    Calories: {item.calories}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-gray-600 font-medium">×{item.quantity}</div>
                                <div className="text-xs text-gray-500">₹{item.totalPrice}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 uppercase">Payment:</span>
                <span className={`text-xs font-medium ${
                    order.paymentStatus === 'paid' 
                        ? 'text-green-600' 
                        : 'text-yellow-600'
                }`}>
                    {order.paymentStatus}
                </span>
            </div>

            {order.deliveryTime && (
                <div className="text-sm text-gray-600">
                    <span className="text-xs text-gray-500 uppercase">Delivery Time: </span>
                    {formatDate(order.deliveryTime)}
                </div>
            )}

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Total Amount</p>
                    <p className="text-lg font-semibold text-teal-600">₹{order.totalAmount}</p>
                </div>
                <div className="flex gap-2">
                    {order.status !== 'completed' && (
                        <button
                            onClick={() => updateOrder(order._id, 'completed', order.totalAmount)}
                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                            title="Mark as Completed"
                        >
                            <Check className="w-5 h-5" />
                        </button>
                    )}
                    {order.status !== 'cancelled' && (
                        <button
                            onClick={() => updateOrder(order._id, 'cancelled', 0)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Cancel Order"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    </div>
))}
      </div>
    </div>
  );
};

export default OrdersTable;