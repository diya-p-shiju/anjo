import React, { useState } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  vendorId: string;
  menuItemId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ vendorId, menuItemId }) => {
  const [score, setScore] = useState(5);
  const [hoverScore, setHoverScore] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const reviewData = {
      userId: localStorage.getItem('_id'),
      vendorId: vendorId,
      reviewItem: {
        menuItemId: menuItemId,
        score: score,
        description: description
      },
      name: localStorage.getItem('name'),
      email: localStorage.getItem('email'),
      mobileNumber: localStorage.getItem('mobileNumber')
    };

    try {
      const response = await axios.post('http://localhost:3000/review', reviewData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.data.status === 'success') {
        setSuccess(true);
        setDescription('');
        setScore(5);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting review');
    } finally {
      setLoading(false);
    }
  };

  const StarRating = () => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setScore(star)}
          onMouseEnter={() => setHoverScore(star)}
          onMouseLeave={() => setHoverScore(0)}
          className="transition-transform hover:scale-110 focus:outline-none"
        >
          <Star
            className={`w-8 h-8 sm:w-10 sm:h-10 ${
              star <= (hoverScore || score)
                ? 'fill-teal-500 text-teal-500'
                : 'fill-gray-200 text-gray-200'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-sm">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Write a Review</h2>
        <p className="mt-1 text-sm text-gray-600">Share your experience with others</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div className="flex flex-col items-center gap-2">
          <label className="block text-sm font-medium text-gray-700">
            How would you rate your experience?
          </label>
          <StarRating />
          <span className="text-sm text-gray-600">
            {score === 1 && "Poor"}
            {score === 2 && "Fair"}
            {score === 3 && "Good"}
            {score === 4 && "Very Good"}
            {score === 5 && "Excellent"}
          </span>
        </div>

        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tell us more about your experience
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="block w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
            placeholder="Write your review here..."
          />
        </div>

        {/* Status Messages */}
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-teal-50 p-3 text-sm text-teal-700">
            Thank you for your review!
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors ${
            loading ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit Review'
          )}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;