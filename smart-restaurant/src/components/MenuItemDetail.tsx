import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ClockIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  XMarkIcon,
  CreditCardIcon,
  BanknotesIcon,
  TagIcon
} from '@heroicons/react/24/outline';

interface MenuItemDetailProps {
  item: {
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
  };
  onClose: () => void;
  onAddToCart: (item: any, quantity: number, selectedSize?: string) => void;
}

const MenuItemDetail: React.FC<MenuItemDetailProps> = ({ item, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    item.priceList?.[0]?.size
  );

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  const getCurrentPrice = () => {
    let price = item.price;
    if (item.priceList && selectedSize) {
      const selectedPrice = item.priceList.find(p => p.size === selectedSize);
      price = selectedPrice?.price || item.price;
    }
    if (item.isSpecialOffer) {
      price = price * (1 - (item.specialOfferDetails?.discount || 0) / 100);
    }
    return price;
  };

  const handleAddToCart = () => {
    onAddToCart(item, quantity, selectedSize);
    onClose();
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
        {/* Header */}
        <div className="relative">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-64 object-cover rounded-t-xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          {!item.isAvailable && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full">
              Currently Unavailable
            </div>
          )}
          {item.isSpecialOffer && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full">
              {item.specialOfferDetails?.discount}% OFF
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>

          {/* Dietary Restrictions */}
          {item.dietaryRestrictions && item.dietaryRestrictions.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Dietary Information</h3>
              <div className="flex flex-wrap gap-2">
                {item.dietaryRestrictions.map(restriction => (
                  <span
                    key={restriction}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                  >
                    {restriction}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Special Offer */}
          {item.isSpecialOffer && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <TagIcon className="w-5 h-5" />
                <span className="font-semibold">Special Offer!</span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {item.specialOfferDetails?.discount}% off until {new Date(item.specialOfferDetails?.validUntil || '').toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Availability */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Available Days
            </h3>
            <div className="flex flex-wrap gap-2">
              {item.availableDays.map(day => (
                <span
                  key={day}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>

          {/* Preparation Time */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <ClockIcon className="w-5 h-5" />
              Preparation Time
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {item.preparationTime} minutes
            </p>
          </div>

          {/* Price List */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <CurrencyDollarIcon className="w-5 h-5" />
              Price
            </h3>
            {item.priceList ? (
              <div className="space-y-2">
                {item.priceList.map(price => (
                  <label
                    key={price.size}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="size"
                      value={price.size}
                      checked={selectedSize === price.size}
                      onChange={() => setSelectedSize(price.size)}
                      className="w-4 h-4"
                    />
                    <span>{price.size}</span>
                    <span className="ml-auto font-semibold">
                      {item.isSpecialOffer ? (
                        <>
                          <span className="line-through text-gray-500 mr-2">
                            ${price.price.toFixed(2)}
                          </span>
                          ${(price.price * (1 - (item.specialOfferDetails?.discount || 0) / 100)).toFixed(2)}
                        </>
                      ) : (
                        `$${price.price.toFixed(2)}`
                      )}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-xl font-bold">
                {item.isSpecialOffer ? (
                  <>
                    <span className="line-through text-gray-500 mr-2">
                      ${item.price.toFixed(2)}
                    </span>
                    ${(item.price * (1 - (item.specialOfferDetails?.discount || 0) / 100)).toFixed(2)}
                  </>
                ) : (
                  `$${item.price.toFixed(2)}`
                )}
              </p>
            )}
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Payment Methods</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <CreditCardIcon className="w-6 h-6" />
                <span>Credit Card</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <BanknotesIcon className="w-6 h-6" />
                <span>Cash on Delivery</span>
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                -
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
              className={`flex-1 btn-primary ${
                !item.isAvailable ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Add to Cart - ${(getCurrentPrice() * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MenuItemDetail; 