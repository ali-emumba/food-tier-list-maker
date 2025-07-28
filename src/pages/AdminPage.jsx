import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { addFoodItem, updateFoodItem, deleteFoodItem, useFoodItems } from '../hooks/useFirebase';
import { useUserStore } from '../store/userStore';
import Header from '../components/Header';
import EditFoodItemModal from '../components/EditFoodItemModal';

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const { getUserDisplayName } = useUserStore();
  const { foodItems, loading: foodItemsLoading } = useFoodItems();
  const navigate = useNavigate();  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: 'Diet Meals',
    description: ''
  });

  // Redirect if not admin
  React.useEffect(() => {
    if (user && !isAdmin) {
      navigate('/dashboard');
    }
  }, [user, isAdmin, navigate]);

  const categories = ['Diet Meals', 'Curry', 'Rice', 'Snacks'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Food name is required');
      }

      // Add food item to Firebase
      const result = await addFoodItem({
        ...formData,
        name: formData.name.trim(),
        addedBy: getUserDisplayName()
      });      if (result.success) {
        setMessage(`✅ Successfully added "${formData.name}" to the database!`);
        setFormData({
          name: '',
          category: 'Diet Meals',
          description: ''
        });
        // Clear message after 5 seconds
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error adding food item:', error);
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (itemId, updateData) => {
    try {
      const result = await updateFoodItem(itemId, {
        ...updateData,
        updatedBy: getUserDisplayName()
      });      if (result.success) {
        setMessage(`✅ Successfully updated "${updateData.name}"!`);
        setIsEditModalOpen(false);
        setEditingItem(null);
        // Clear message after 5 seconds
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error updating food item:', error);
      setMessage(`❌ Error updating item: ${error.message}`);
    }
  };
  const handleDeleteItem = async (itemId, itemName) => {
    try {
      const result = await deleteFoodItem(itemId);      if (result.success) {
        setMessage(`✅ Successfully deleted "${itemName}" and ${result.deletedRatings} related ratings!`);
        setIsEditModalOpen(false);
        setEditingItem(null);
        // Clear message after 5 seconds
        setTimeout(() => setMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error deleting food item:', error);
      setMessage(`❌ Error deleting item: ${error.message}`);
    }
  };

  const handleDeleteItemFromGrid = async (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"? This will also delete all related ratings and cannot be undone.`)) {
      await handleDeleteItem(item.id, item.name);
    }
  };

  // Filter food items based on search and category
  const filteredFoodItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === '' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Please log in to access this page.</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 text-lg font-medium mb-2">Access Denied</div>
            <div className="text-gray-600">You don't have admin privileges.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🔐 Admin Panel
            </h1>            <p className="text-gray-600">
              Welcome, {getUserDisplayName()}! Add new food items to the database.
            </p>
          </div>

          {/* Add Food Item Form */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Add New Food Item
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Food Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Food Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Chicken Biryani Special"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Optional description or additional details..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </div>
                  ) : (
                    'Add Food Item'
                  )}
                </button>
              </div>
            </form>

            {/* Message Display */}
            {message && (
              <div className={`mt-4 p-4 rounded-md ${
                message.includes('✅') 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-800'
              }`}>
                {message}
              </div>
            )}
          </div>          {/* Manage Existing Food Items */}
          <div className="mt-8 bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Manage Existing Food Items
              </h2>
              {!foodItemsLoading && (
                <div className="text-sm text-gray-600">
                  {filteredFoodItems.length === foodItems.length 
                    ? `${foodItems.length} total items`
                    : `${filteredFoodItems.length} of ${foodItems.length} items`
                  }
                </div>
              )}
            </div>

            {foodItemsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading food items...</span>
              </div>
            ) : (
              <div className="space-y-4">                {/* Search/Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Search food items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {(searchTerm || selectedCategory) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('');
                      }}
                      className="px-3 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>{/* Food Items List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredFoodItems.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {item.category}
                        </span>
                      </div>
                      
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      )}
                      
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                        <span>ID: {item.id}</span>
                        {item.createdAt && (
                          <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItemFromGrid(item)}
                          className="px-3 py-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredFoodItems.length === 0 && foodItems.length > 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No food items match your search criteria. Try adjusting your search or filter.
                  </div>
                )}

                {foodItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No food items found. Add some items above to get started!
                  </div>
                )}
              </div>
            )}
          </div>          {/* Admin Info */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              📋 Admin Instructions
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Add:</strong> New food items are immediately available to all users for rating</li>
              <li>• <strong>Edit:</strong> Changes to food items update instantly for all users</li>
              <li>• <strong>Delete:</strong> Removes food item and all its ratings permanently (cannot be undone)</li>
              <li>• <strong>Search:</strong> Filter items by name, description, or category</li>
              <li>• All changes are logged with your admin account for audit purposes</li>
            </ul>
          </div>
        </div>
      </main>      {/* Edit Food Item Modal */}
      {isEditModalOpen && editingItem && (
        <EditFoodItemModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          foodItem={editingItem}
          onSave={handleSaveEdit}
          onDelete={(itemId) => handleDeleteItem(itemId, editingItem.name)}
        />
      )}
    </div>
  );
};

export default AdminPage;
