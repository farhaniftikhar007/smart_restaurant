import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  availableDays: string[];
  preparationTime: number;
  priceList?: {
    size: string;
    price: number;
  }[];
  dietaryRestrictions?: string[];
  isSpecialOffer?: boolean;
  specialOfferDetails?: {
    discount: number;
    validUntil: string;
  };
}

interface MenuItemFormProps {
  item?: MenuItem;
  onSubmit: (item: Omit<MenuItem, 'id'>) => void;
  onCancel: () => void;
}

const categories = ['pizza', 'salad', 'bowl', 'main', 'dessert', 'drinks'];
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten Free' },
  { id: 'dairy-free', label: 'Dairy Free' },
  { id: 'nut-free', label: 'Nut Free' },
  { id: 'halal', label: 'Halal' },
  { id: 'kosher', label: 'Kosher' }
];

const MenuItemForm: React.FC<MenuItemFormProps> = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<MenuItem, 'id'>>({
    name: '',
    description: '',
    price: 0,
    category: 'pizza',
    image: '',
    isAvailable: true,
    availableDays: [],
    preparationTime: 15,
    priceList: [],
    dietaryRestrictions: [],
    isSpecialOffer: false,
    specialOfferDetails: {
      discount: 0,
      validUntil: new Date().toISOString().split('T')[0]
    }
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        isAvailable: item.isAvailable,
        availableDays: item.availableDays,
        preparationTime: item.preparationTime,
        priceList: item.priceList || [],
        dietaryRestrictions: item.dietaryRestrictions || [],
        isSpecialOffer: item.isSpecialOffer || false,
        specialOfferDetails: item.specialOfferDetails || {
          discount: 0,
          validUntil: new Date().toISOString().split('T')[0]
        }
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handleDietaryToggle = (restriction: string) => {
    setFormData(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions?.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...(prev.dietaryRestrictions || []), restriction]
    }));
  };

  const handlePriceListChange = (index: number, field: 'size' | 'price', value: string | number) => {
    setFormData(prev => {
      const newPriceList = [...(prev.priceList || [])];
      newPriceList[index] = {
        ...newPriceList[index],
        [field]: field === 'price' ? parseFloat(value as string) || 0 : value
      };
      return {
        ...prev,
        priceList: newPriceList
      };
    });
  };

  const addPriceListEntry = () => {
    setFormData(prev => ({
      ...prev,
      priceList: [...(prev.priceList || []), { size: '', price: 0 }]
    }));
  };

  const removePriceListEntry = (index: number) => {
    setFormData(prev => ({
      ...prev,
      priceList: prev.priceList?.filter((_, i) => i !== index)
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {item ? 'Edit Menu Item' : 'Add Menu Item'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field w-full"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleNumberChange}
                  className="input-field w-full"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field w-full"
                  required
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="input-field w-full"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Preparation Time (minutes)</label>
                <input
                  type="number"
                  name="preparationTime"
                  value={formData.preparationTime}
                  onChange={handleNumberChange}
                  className="input-field w-full"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Availability</label>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4"
                  />
                  <span className="ml-2">Available</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Available Days</label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.availableDays.includes(day)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Dietary Restrictions</label>
              <div className="flex flex-wrap gap-2">
                {dietaryOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleDietaryToggle(option.id)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.dietaryRestrictions?.includes(option.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price List (Optional)</label>
              <div className="space-y-2">
                {formData.priceList?.map((price, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={price.size}
                      onChange={(e) => handlePriceListChange(index, 'size', e.target.value)}
                      placeholder="Size"
                      className="input-field flex-1"
                    />
                    <input
                      type="number"
                      value={price.price}
                      onChange={(e) => handlePriceListChange(index, 'price', e.target.value)}
                      placeholder="Price"
                      className="input-field w-32"
                      min="0"
                      step="0.01"
                    />
                    <button
                      type="button"
                      onClick={() => removePriceListEntry(index)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-full"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPriceListEntry}
                  className="text-blue-500 hover:text-blue-600"
                >
                  + Add Size/Price
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  name="isSpecialOffer"
                  checked={formData.isSpecialOffer}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4"
                />
                <span>Special Offer</span>
              </div>
              {formData.isSpecialOffer && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Discount (%)</label>
                    <input
                      type="number"
                      name="specialOfferDetails.discount"
                      value={formData.specialOfferDetails?.discount}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        specialOfferDetails: {
                          ...prev.specialOfferDetails!,
                          discount: parseFloat(e.target.value) || 0
                        }
                      }))}
                      className="input-field w-full"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Valid Until</label>
                    <input
                      type="date"
                      name="specialOfferDetails.validUntil"
                      value={formData.specialOfferDetails?.validUntil}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        specialOfferDetails: {
                          ...prev.specialOfferDetails!,
                          validUntil: e.target.value
                        }
                      }))}
                      className="input-field w-full"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {item ? 'Update' : 'Add'} Item
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MenuItemForm; 