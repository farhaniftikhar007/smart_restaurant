import React from 'react';
import { motion } from 'framer-motion';

interface DietaryFilterProps {
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

const dietaryOptions = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten Free' },
  { id: 'dairy-free', label: 'Dairy Free' },
  { id: 'nut-free', label: 'Nut Free' },
  { id: 'halal', label: 'Halal' },
  { id: 'kosher', label: 'Kosher' }
];

const DietaryFilter: React.FC<DietaryFilterProps> = ({ selectedFilters, onFilterChange }) => {
  const handleFilterToggle = (filterId: string) => {
    if (selectedFilters.includes(filterId)) {
      onFilterChange(selectedFilters.filter(id => id !== filterId));
    } else {
      onFilterChange([...selectedFilters, filterId]);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Dietary Preferences</h3>
      <div className="flex flex-wrap gap-2">
        {dietaryOptions.map(option => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleFilterToggle(option.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedFilters.includes(option.id)
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default DietaryFilter; 