import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wallet, User as UserIcon, Clock, Mail } from 'lucide-react';

const VendorStatsBanner = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('_id');
        if (!userId) {
          throw new Error('User ID not found');
        }

        const response = await axios.get(`http://localhost:3000/user/${userId}`);
        setUserData(response.data.data.items); // Access the data property from response
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-white rounded-xl shadow-sm p-8 animate-pulse">
        <div className="h-24 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-red-50 border-2 border-red-100 rounded-xl p-4 text-red-600">
        Error loading user data: {error}
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl shadow-lg overflow-hidden">
      {/* Header Section */}
      <div className="px-6 py-4 bg-white/10 backdrop-blur-sm">
        <h2 className="text-white text-lg font-semibold">
          Account Overview
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        {/* Credits Card */}
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Available Credits</p>
              <h3 className="text-white text-2xl font-bold">
                ₹{userData?.credits?.toLocaleString() || '0'}
              </h3>
            </div>
            <div className="bg-teal-400 rounded-lg p-2">
              <Wallet className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 text-white/80 text-sm">
            <span className="font-medium text-white capitalize">
              {userData?.role || 'User'}
            </span>
            <span className="ml-1">account</span>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Account Name</p>
              <h3 className="text-white text-xl font-bold truncate max-w-[180px]">
                {userData?.name || 'N/A'}
              </h3>
            </div>
            <div className="bg-teal-400 rounded-lg p-2">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 text-white/80 text-sm">
            <span className="font-medium text-white capitalize">
              {userData?.userCategory?.replace(/_/g, ' ') || 'N/A'}
            </span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Contact Info</p>
              <h3 className="text-white text-lg font-bold truncate max-w-[180px]">
                {userData?.email || 'N/A'}
              </h3>
            </div>
            <div className="bg-teal-400 rounded-lg p-2">
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 text-white/80 text-sm">
            <span className="font-medium text-white">
              {userData?.mobileNumber || 'N/A'}
            </span>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 hover:bg-white/30 transition-colors">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Member Since</p>
              <h3 className="text-white text-lg font-bold">
                {new Date(userData?.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </h3>
            </div>
            <div className="bg-teal-400 rounded-lg p-2">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="mt-4 text-white/80 text-sm">
            <span className="font-medium text-white">Active</span>
            <span className="ml-1">account status</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorStatsBanner;