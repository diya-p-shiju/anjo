import React, { useState, useEffect } from 'react';
import { Star, Search, Grid2X2, List, Filter } from 'lucide-react';

const MenuReviewsGrid = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  useEffect(() => {
    const fetchMenuReviews = async () => {
      try {
        const response = await fetch('http://localhost:3000/review');
        const data = await response.json();
        
        if (data.status === 'success') {
          // Group reviews by menu item
          const groupedReviews = data.data.reduce((acc, review) => {
            const menuItemId = review.menuItem.id;
            if (!acc[menuItemId]) {
              acc[menuItemId] = {
                id: menuItemId,
                name: review.menuItem.name,
                reviews: []
              };
            }
            acc[menuItemId].reviews.push(review);
            return acc;
          }, {});
          
          setMenuItems(Object.values(groupedReviews));
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        setError('Failed to load menu items and reviews');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuReviews();
  }, []);

  const calculateAverageRating = (reviews) => {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < Math.floor(rating)
            ? 'fill-teal-500 text-teal-500'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">
        {error}
      </div>
    );
  }

  const filteredItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Menu Items & Reviews</h2>
          
          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full sm:w-64"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                <Grid2X2 size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                <List size={20} />
              </button>
              <button
                className="p-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300"
              >
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Menu Item Header */}
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStars(calculateAverageRating(item.reviews))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({calculateAverageRating(item.reviews)}/5 • {item.reviews.length} reviews)
                  </span>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="divide-y divide-gray-100">
                {item.reviews.map((review) => (
                  <div key={review._id} className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {review.rating}/5
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{review.reviewerName}</span>
                      <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600">No menu items found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuReviewsGrid;