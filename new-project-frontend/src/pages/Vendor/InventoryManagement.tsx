import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiAlertCircle, FiPlus, FiMinus, FiFilter, FiRefreshCw, FiX } from 'react-icons/fi';

const Inventory = () => {
  // State variables
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [filter, setFilter] = useState({
    category: '',
    status: '',
    query: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0,
    outOfStock: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'ingredients',
    quantity: 0,
    unit: 'pcs',
    minThreshold: 5,
    costPrice: 0,
    vendor: '',
    expiryDate: '',
    notes: ''
  });

  // Get user role from localStorage
  const role = localStorage.getItem('role');
  const isVendor = role === 'vendor';
  const isAdmin = role === 'admin';
  const canModify = isVendor; // Only vendor can modify

  // Base URL for API requests
  const baseUrl = 'http://localhost:3000';

  // API functions
  const api = {
    getAllInventory: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${baseUrl}/inventory?${queryString}` : `${baseUrl}/inventory`;
      return axios.get(url);
    },
    
    getInventoryItem: async (id) => {
      return axios.get(`${baseUrl}/inventory/${id}`);
    },
    
    createInventoryItem: async (data) => {
      return axios.post(`${baseUrl}/inventory`, data);
    },
    
    updateInventoryItem: async (id, data) => {
      return axios.put(`${baseUrl}/inventory/${id}`, data);
    },
    
    deleteInventoryItem: async (id) => {
      return axios.delete(`${baseUrl}/inventory/${id}`);
    },
    
    updateInventoryQuantity: async (id, quantity, operation) => {
      return axios.patch(`${baseUrl}/inventory/${id}/quantity`, { quantity, operation });
    }
  };

  // Load inventory items
  const loadInventoryItems = async () => {
    try {
      setLoading(true);
      
      const params = {};
      if (filter.category) params.category = filter.category;
      if (filter.status) params.status = filter.status;
      
      const response = await api.getAllInventory(params);
      
      let filteredItems = response.data.data;
      
      // Client-side search filtering
      if (filter.query) {
        const query = filter.query.toLowerCase();
        filteredItems = filteredItems.filter(item => 
          item.name.toLowerCase().includes(query) || 
          item.vendor.toLowerCase().includes(query)
        );
      }
      
      setInventoryItems(filteredItems);
      
      // Calculate statistics
      const total = filteredItems.length;
      const lowStock = filteredItems.filter(item => item.status === 'low-stock').length;
      const outOfStock = filteredItems.filter(item => item.status === 'out-of-stock').length;
      
      setStats({
        total,
        lowStock,
        outOfStock
      });
      
      setError(null);
    } catch (err) {
      console.error('Error loading inventory:', err);
      setError('Failed to load inventory items');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount and when filter changes
  useEffect(() => {
    loadInventoryItems();
  }, [filter]);

  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      category: 'ingredients',
      quantity: 0,
      unit: 'pcs',
      minThreshold: 5,
      costPrice: 0,
      vendor: '',
      expiryDate: '',
      notes: ''
    });
  };

  // Open modal for adding new item
  const handleAddNew = () => {
    if (!canModify) return;
    
    resetForm();
    setModalMode('add');
    setShowModal(true);
  };

  // Open modal for editing item
  const handleEdit = (item) => {
    if (!canModify) return;
    
    const expiryDate = item.expiryDate 
      ? new Date(item.expiryDate).toISOString().split('T')[0] 
      : '';
      
    setFormData({
      name: item.name || '',
      category: item.category || 'ingredients',
      quantity: item.quantity || 0,
      unit: item.unit || 'pcs',
      minThreshold: item.minThreshold || 5,
      costPrice: item.costPrice || 0,
      vendor: item.vendor || '',
      expiryDate: expiryDate,
      notes: item.notes || ''
    });
    
    setCurrentItem(item);
    setModalMode('edit');
    setShowModal(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.vendor) {
      setError('Name and vendor are required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      // Parse numeric values
      const itemData = {
        ...formData,
        quantity: Number(formData.quantity),
        minThreshold: Number(formData.minThreshold),
        costPrice: Number(formData.costPrice)
      };
      
      if (modalMode === 'add') {
        await api.createInventoryItem(itemData);
      } else {
        await api.updateInventoryItem(currentItem._id, itemData);
      }
      
      // Close modal and refresh list
      setShowModal(false);
      resetForm();
      loadInventoryItems();
    } catch (err) {
      console.error('Error saving inventory item:', err);
      setError('Failed to save inventory item');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete item
  const handleDelete = async (id) => {
    if (!canModify) return;
    
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.deleteInventoryItem(id);
        loadInventoryItems();
      } catch (err) {
        console.error('Error deleting item:', err);
        setError('Failed to delete item');
      }
    }
  };

  // Handle update quantity
  const handleUpdateQuantity = async (id, quantity, operation) => {
    if (!canModify) return;
    
    try {
      await api.updateInventoryQuantity(id, quantity, operation);
      loadInventoryItems();
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity');
    }
  };

  // Get status color class
  const getStatusColorClass = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get category color class
  const getCategoryColorClass = (category) => {
    switch (category) {
      case 'ingredients':
        return 'bg-blue-100 text-blue-800';
      case 'beverages':
        return 'bg-purple-100 text-purple-800';
      case 'snacks':
        return 'bg-orange-100 text-orange-800';
      case 'packaging':
        return 'bg-indigo-100 text-indigo-800';
      case 'cleaning':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 md:mb-0">Inventory Management</h1>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter className="text-gray-500" /> Filters
          </button>
          
          {canModify && (
            <button
              className="flex items-center gap-2 px-3 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              onClick={handleAddNew}
            >
              <FiPlus /> Add New Item
            </button>
          )}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-teal-100 text-teal-600">
              <FiRefreshCw size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Items</p>
              <h3 className="text-2xl font-semibold">{stats.total}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FiAlertCircle size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Low Stock Items</p>
              <h3 className="text-2xl font-semibold">{stats.lowStock}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FiAlertCircle size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Out of Stock</p>
              <h3 className="text-2xl font-semibold">{stats.outOfStock}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                name="query"
                placeholder="Search by name or vendor"
                className="w-full p-2 border border-gray-300 rounded"
                value={filter.query}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                className="w-full p-2 border border-gray-300 rounded"
                value={filter.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                <option value="ingredients">Ingredients</option>
                <option value="beverages">Beverages</option>
                <option value="snacks">Snacks</option>
                <option value="packaging">Packaging</option>
                <option value="cleaning">Cleaning</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                className="w-full p-2 border border-gray-300 rounded"
                value={filter.status}
                onChange={handleFilterChange}
              >
                <option value="">All Status</option>
                <option value="available">Available</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                className="w-full p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                onClick={() => setFilter({ category: '', status: '', query: '' })}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
            <p className="mt-2 text-gray-500">Loading inventory...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  {canModify && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryItems.length > 0 ? (
                  inventoryItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-xs text-gray-500">Last restocked: {new Date(item.lastRestocked).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColorClass(item.category)}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 mr-2">
                            {item.quantity} {item.unit}
                          </span>
                          {canModify && (
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleUpdateQuantity(item._id, 1, 'add')}
                                className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                              >
                                <FiPlus size={14} />
                              </button>
                              <button
                                onClick={() => handleUpdateQuantity(item._id, 1, 'subtract')}
                                className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                                disabled={item.quantity <= 0}
                              >
                                <FiMinus size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">Min: {item.minThreshold} {item.unit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.vendor}
                      </td>
                      {canModify && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-teal-600 hover:text-teal-900"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={canModify ? 6 : 5} className="px-6 py-8 text-center text-sm text-gray-500">
                      No inventory items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium text-gray-900">
                {modalMode === 'add' ? 'Add New Inventory Item' : 'Edit Inventory Item'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <select
                    name="category"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="ingredients">Ingredients</option>
                    <option value="beverages">Beverages</option>
                    <option value="snacks">Snacks</option>
                    <option value="packaging">Packaging</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity*
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit*
                  </label>
                  <select
                    name="unit"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.unit}
                    onChange={handleChange}
                    required
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="g">Gram (g)</option>
                    <option value="l">Liter (l)</option>
                    <option value="ml">Milliliter (ml)</option>
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="packs">Packs</option>
                    <option value="boxes">Boxes</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Threshold*
                  </label>
                  <input
                    type="number"
                    name="minThreshold"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.minThreshold}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Alert when quantity falls below this value</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost Price*
                  </label>
                  <input
                    type="number"
                    name="costPrice"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.costPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vendor/Supplier*
                  </label>
                  <input
                    type="text"
                    name="vendor"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.vendor}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.expiryDate}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
                >
                  {modalMode === 'add' ? 'Add Item' : 'Update Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;