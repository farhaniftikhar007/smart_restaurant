import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center">
                <span className="text-3xl font-bold text-orange-600">
                  {user.full_name?.[0] || user.username[0]}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {user.full_name || user.username}
                </h1>
                <p className="text-orange-100 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="px-6 py-8">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Profile Information</h2>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Full Name
                </label>
                <p className="text-lg text-gray-900">{user.full_name || 'Not provided'}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Username
                </label>
                <p className="text-lg text-gray-900">{user.username}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Email Address
                </label>
                <p className="text-lg text-gray-900">{user.email}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Phone
                </label>
                <p className="text-lg text-gray-900">{user.phone || 'Not provided'}</p>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Account Type
                </label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 capitalize">
                  {user.role}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Account Status
                </label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4">
            <button 
              onClick={() => navigate('/profile/edit')}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
