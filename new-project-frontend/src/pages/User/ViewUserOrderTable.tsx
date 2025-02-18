import React, { useState, useEffect } from 'react';
import { AlertCircle, X, RefreshCcw, Star } from 'lucide-react';
import axios from 'axios';

interface MenuItem {
  id: string;
  name: string;
  quantity: number;
}

interface Order {
  _id: string;
  userId: string;
  menuItems: { name: string; quantity: number; menuItemId: string; }[];
  totalAmount: number;
  status: string;
  vendorId: string;
  createdAt: string;
}

interface Review {
  _id: string;
  userId: string;
  orderId: string;
  orderDate: string;
  menuItem: {
    id: string;
    name: string;
    quantity: number;
  };
  vendorId: string;
  vendorName: string;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerEmail: string;
  reviewerMobile: string;
  createdAt: string;
}

interface UpdateStatus {
  show: boolean;
  message: string;
  type: string;
}

const StarRating = ({ value, onChange }: { value: number; onChange: (score: number) => void }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="focus:outline-none"
        >
          <Star
            className={`w-6 h-6 ${
              star <= value
                ? 'fill-teal-500 text-teal-500'
                : 'fill-gray-200 text-gray-200'
            } hover:fill-teal-400 hover:text-teal-400 transition-colors`}
          />
        </button>
      ))}
    </div>
  );
};

const UserOrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({ 
    show: false, 
    message: '', 
    type: '' 
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{
    orderId: string;
    menuItem: {
      id: string;
      name: string;
      quantity: number;
    };
  } | null>(null);
  const [rating, setRating] = useState(0);

  const userId = localStorage.getItem('_id');
  const userName = localStorage.getItem('name');
  const userEmail = localStorage.getItem('email');
  const userMobile = localStorage.getItem('mobileNumber');
  
  const baseUrl = 'http://localhost:3000';

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/order`);
      const result = response.data;
      
      if (result.status === 'success') {
        const userOrders = result.data.filter((order: Order) => order.userId === userId);
        setOrders(userOrders);
        setError(null);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${baseUrl}/review`, {
        params: { userId }
      });
      
      if (response.data.status === 'success') {
        setReviews(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    }
  };

  const submitReview = async (comment: string) => {
    if (!selectedOrder) return;

    try {
      const reviewData = {
        userId,
        orderId: selectedOrder.orderId,
        menuItem: selectedOrder.menuItem,
        rating,
        comment,
        reviewerName: userName,
        reviewerEmail: userEmail,
        reviewerMobile: userMobile,
      };

      const response = await axios.post(`${baseUrl}/review`, reviewData);
      
      if (response.data.status === 'success') {
        await fetchReviews();
        setUpdateStatus({
          show: true,
          message: 'Review submitted successfully.',
          type: 'success'
        });
        setShowReviewModal(false);
      }
    } catch (err: any) {
      setUpdateStatus({
        show: true,
        message: err.response?.data?.message || 'Failed to submit review. Please try again.',
        type: 'error'
      });
    }
    
    setTimeout(() => {
      setUpdateStatus({ show: false, message: '', type: '' });
    }, 3000);
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const response = await axios.put(`${baseUrl}/order/${orderId}`, {
        status: 'cancelled'
      });
      
      if (response.data.status === 'success') {
        setUpdateStatus({
          show: true,
          message: 'Order cancelled successfully.',
          type: 'success'
        });
        fetchOrders();
      }
    } catch (err) {
      setUpdateStatus({
        show: true,
        message: 'Failed to cancel order. Please try again.',
        type: 'error'
      });
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCcw className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  const getReviewForOrderItem = (orderId: string, menuItemId: string) => {
    return reviews.find(review => 
      review.orderId === orderId && 
      review.menuItem.id === menuItemId
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {updateStatus.show && (
        <div className={`mb-4 p-4 rounded-lg ${
          updateStatus.type === 'success' ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-700'
        }`}>
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {updateStatus.message}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-teal-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                  Reviews
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order._id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.menuItems.map((item, index) => (
                        <div key={index} className="mb-2">
                          {item.name} × {item.quantity}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{order.totalAmount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${order.status === 'processing' ? 'bg-teal-100 text-teal-800' : ''}
                      ${order.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {order.menuItems.map((item, index) => {
                      const review = getReviewForOrderItem(order._id, item.menuItemId);
                      return (
                        <div key={index} className="mb-3 last:mb-0">
                          {review ? (
                            <div className="bg-gray-50 rounded-lg p-2">
                              <div className="flex items-center gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'fill-teal-500 text-teal-500'
                                        : 'fill-gray-200 text-gray-200'
                                    }`}
                                  />
                                ))}
                              </div>
                              <div className="text-gray-600 text-sm">{review.comment}</div>
                            </div>
                          ) : (
                            order.status === 'completed' && (
                              <button
                                onClick={() => {
                                  setSelectedOrder({
                                    orderId: order._id,
                                    menuItem: {
                                      id: item.menuItemId,
                                      name: item.name,
                                      quantity: item.quantity
                                    }
                                  });
                                  setShowReviewModal(true);
                                  setRating(0);
                                }}
                                className="inline-flex items-center text-teal-600 hover:text-teal-800 text-sm bg-teal-50 px-3 py-1 rounded-md"
                              >
                                <Star className="w-4 h-4 mr-1" />
                                Review {item.name}
                              </button>
                            )
                          )}
                        </div>
                      );
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                      <button
                        onClick={() => cancelOrder(order._id)}
                        className="flex items-center text-red-600 hover:text-red-900"
                      >
                        <X className="w-5 h-5 mr-1" />
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Review for {selectedOrder.menuItem.name}</h2>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              submitReview(formData.get('comment') as string);
            }}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  name="comment"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  rows={3}
                  placeholder="Tell us about your experience..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                disabled={rating === 0}
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrdersTable;