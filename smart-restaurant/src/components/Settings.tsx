import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BuildingOfficeIcon,
  ClockIcon,
  UserIcon,
  KeyIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

const Settings: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [restaurantName, setRestaurantName] = useState('My Restaurant');
  const [contactEmail, setContactEmail] = useState('contact@myrestaurant.com');
  const [contactPhone, setContactPhone] = useState('+1 234 567 8900');
  const [address, setAddress] = useState('123 Restaurant St, City, Country');
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([
    { day: 'Monday', open: '11:00', close: '23:00', isClosed: false },
    { day: 'Tuesday', open: '11:00', close: '23:00', isClosed: false },
    { day: 'Wednesday', open: '11:00', close: '23:00', isClosed: false },
    { day: 'Thursday', open: '11:00', close: '23:00', isClosed: false },
    { day: 'Friday', open: '12:00', close: '23:00', isClosed: false },
    { day: 'Saturday', open: '11:00', close: '23:00', isClosed: false },
    { day: 'Sunday', open: '11:00', close: '23:00', isClosed: false },
  ]);

  const handleSave = () => {
    // Save settings to backend
    console.log('Saving settings...');
  };

  const toggleBusinessHours = (index: number) => {
    setBusinessHours(businessHours.map((hours, i) => 
      i === index ? { ...hours, isClosed: !hours.isClosed } : hours
    ));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Restaurant Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BuildingOfficeIcon className="w-5 h-5 mr-2" />
            Restaurant Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Restaurant Name
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="input-field w-full"
                rows={3}
              />
            </div>
          </div>
        </motion.div>

        {/* Business Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <ClockIcon className="w-5 h-5 mr-2" />
            Business Hours
          </h2>

          <div className="space-y-4">
            {businessHours.map((hours, index) => (
              <div key={hours.day} className="flex items-center gap-4">
                <div className="w-32">
                  <span className="font-medium">{hours.day}</span>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(e) => {
                      const newHours = [...businessHours];
                      newHours[index].open = e.target.value;
                      setBusinessHours(newHours);
                    }}
                    disabled={hours.isClosed}
                    className="input-field"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(e) => {
                      const newHours = [...businessHours];
                      newHours[index].close = e.target.value;
                      setBusinessHours(newHours);
                    }}
                    disabled={hours.isClosed}
                    className="input-field"
                  />
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hours.isClosed}
                    onChange={() => toggleBusinessHours(index)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Closed</span>
                </label>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            {isDarkMode ? (
              <MoonIcon className="w-5 h-5 mr-2" />
            ) : (
              <SunIcon className="w-5 h-5 mr-2" />
            )}
            Appearance
          </h2>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Dark Mode</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Toggle dark mode for the application
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 bg-gray-200 dark:bg-orange-500"
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isDarkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <UserIcon className="w-5 h-5 mr-2" />
            Account Settings
          </h2>

          <div className="space-y-4">
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
              Change Password
            </button>
            <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              Update Profile
            </button>
          </div>
        </motion.div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings; 