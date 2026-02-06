import { API_BASE_URL } from "../config/api";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, UserGroupIcon, ChatBubbleLeftIcon, CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ReservationForm {
  date: string;
  time: string;
  guests: number;
  specialRequests: string;
  name: string;
  email: string;
  phone: string;
}

interface TableAvailability {
  time: string;
  available: boolean;
  remainingTables: number;
}

interface ValidationErrors {
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  guests?: string;
}

const Reservation: React.FC = () => {
  const [formData, setFormData] = useState<ReservationForm>({
    date: '',
    time: '',
    guests: 2,
    specialRequests: '',
    name: '',
    email: '',
    phone: ''
  });

  const dateInputRef = React.useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [tableAvailability, setTableAvailability] = useState<TableAvailability[]>([]);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const timeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
    '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];

  const validateForm = () => {
    const errors: ValidationErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = 'Invalid phone number format';
    }

    if (!formData.date) {
      errors.date = 'Date is required';
    }

    if (!formData.time) {
      errors.time = 'Time is required';
    }

    if (!formData.guests) {
      errors.guests = 'Number of guests is required';
    }

    setValidationErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    validateForm();
  }, [formData]);

  const checkAvailability = async () => {
    if (!formData.date || !formData.guests) return;

    setIsCheckingAvailability(true);
    // Simulate API call to check table availability
    setTimeout(() => {
      const availability = timeSlots.map(time => ({
        time,
        available: Math.random() > 0.3,
        remainingTables: Math.floor(Math.random() * 5) + 1
      }));
      setTableAvailability(availability);
      setIsCheckingAvailability(false);
    }, 1000);
  };

  useEffect(() => {
    if (formData.date && formData.guests) {
      checkAvailability();
    }
  }, [formData.date, formData.guests]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirmation(true);
  };

  const handleConfirmReservation = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Reservation created:", data);
        setIsSubmitting(false);
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            date: "",
            time: "",
            guests: 2,
            specialRequests: "",
          });
        }, 3000);
      } else {
        throw new Error(data.detail || "Failed to create reservation");
      }
    } catch (error: any) {
      console.error("❌ Reservation error:", error);
      setIsSubmitting(false);
      alert(error.message || "Failed to create reservation. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const ConfirmationModal = () => (
    <AnimatePresence>
      {showConfirmation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-semibold mb-4">Confirm Reservation</h3>
            <div className="space-y-3 mb-6">
              <p><span className="font-medium">Date:</span> {new Date(formData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              <p><span className="font-medium">Time:</span> {formData.time}</p>
              <p><span className="font-medium">Guests:</span> {formData.guests}</p>
              <p><span className="font-medium">Name:</span> {formData.name}</p>
              <p><span className="font-medium">Email:</span> {formData.email}</p>
              <p><span className="font-medium">Phone:</span> {formData.phone}</p>
              {formData.specialRequests && (
                <p><span className="font-medium">Special Requests:</span> {formData.specialRequests}</p>
              )}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReservation}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Confirm Reservation
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const PreviewPanel = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 sticky top-24"
    >
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Reservation Preview</h3>

      <div className="space-y-4">
        {formData.date && (
          <div className="flex items-center space-x-3">
            <CalendarIcon className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{new Date(formData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        )}

        {formData.time && (
          <div className="flex items-center space-x-3">
            <ClockIcon className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-medium">{formData.time}</p>
            </div>
          </div>
        )}

        {formData.guests > 0 && (
          <div className="flex items-center space-x-3">
            <UserGroupIcon className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">Guests</p>
              <p className="font-medium">{formData.guests} {formData.guests === 1 ? 'Guest' : 'Guests'}</p>
            </div>
          </div>
        )}

        {formData.name && (
          <div className="flex items-center space-x-3">
            <div className="h-5 w-5 flex items-center justify-center text-orange-500">
              <span className="text-lg font-medium">{formData.name.charAt(0)}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{formData.name}</p>
            </div>
          </div>
        )}

        {formData.email && (
          <div className="flex items-center space-x-3">
            <div className="h-5 w-5 flex items-center justify-center text-orange-500">
              <span className="text-lg">@</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{formData.email}</p>
            </div>
          </div>
        )}

        {formData.phone && (
          <div className="flex items-center space-x-3">
            <div className="h-5 w-5 flex items-center justify-center text-orange-500">
              <span className="text-lg">📱</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{formData.phone}</p>
            </div>
          </div>
        )}

        {formData.specialRequests && (
          <div className="flex items-start space-x-3">
            <ChatBubbleLeftIcon className="h-5 w-5 text-orange-500 mt-1" />
            <div>
              <p className="text-sm text-gray-500">Special Requests</p>
              <p className="font-medium">{formData.specialRequests}</p>
            </div>
          </div>
        )}

        {!formData.date && !formData.time && !formData.guests && !formData.name && !formData.email && !formData.phone && (
          <div className="text-center py-8">
            <p className="text-gray-500">Fill out the form to see your reservation preview</p>
          </div>
        )}
      </div>

      {isFormValid && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 pt-6 border-t border-gray-200"
        >
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Form Status</span>
            <span className="flex items-center text-green-500">
              <CheckCircleIcon className="h-5 w-5 mr-1" />
              Complete
            </span>
          </div>
          <button
            onClick={() => setShowConfirmation(true)}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Proceed to Confirmation
          </button>
        </motion.div>
      )}
    </motion.div>
  );

  // Check Status Logic
  const [checkPhone, setCheckPhone] = useState('');
  const [statusResult, setStatusResult] = useState<any>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [activeTab, setActiveTab] = useState<'book' | 'status'>('book');

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPhone) return;

    setLoadingStatus(true);
    try {
      // Create a new endpoint or just filter on client side?
      // Since we don't have a specific endpoint yet, let's assume we can fetch by phone or user needs to be logged in.
      // But user said "customer ko kese pata lagega". Guest user context.
      // We will use a new endpoint or list all and filter? List all is risky for privacy.
      // Let's create a quick helper to "mock" this or use existing APIs smartly.
      // Actually, standard is GET /api/reservations/status?phone=...
      // Since I can't easily add a new SEARCH endpoint to backend right now without more work,
      // I will assume the user has to wait for email OR I can implement a quick lookup if I have time.
      // For now, I will add the UI and a "Search" that might just hit the main list if I was an admin, but as a guest...
      // WAIT. I added get_all_reservations for Admin. Guests can't see it.
      // I should add a public "check status" endpoint.

      // Let's assume I added it or I will add it.
      // Actually, let's add the UI first, then fixing the backend endpoint is easy.

      const response = await fetch(`${API_BASE_URL}/api/reservations/search?phone=${checkPhone}`);
      // Use existing endpoint logic if possible, or I need to add one.

      // FALLBACK for demo: The user likely wants to see it work.
      // I will add a search endpoint to reservations.py next.

      if (response.ok) {
        const data = await response.json();
        setStatusResult(data);
      } else {
        setStatusResult(null);
        alert('No reservation found for this phone number.');
      }
    } catch (error) {
      console.error(error);
      alert('Error checking status');
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center mb-8 gap-4">
            <button
              onClick={() => setActiveTab('book')}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${activeTab === 'book' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Book a Table
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${activeTab === 'status' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Check Status
            </button>
          </div>

          {activeTab === 'status' ? (
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-center mb-6">Check Reservation</h2>
              <form onSubmit={handleCheckStatus} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={checkPhone}
                    onChange={(e) => setCheckPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter phone used for booking"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingStatus}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600"
                >
                  {loadingStatus ? 'Checking...' : 'Check Status'}
                </button>
              </form>

              {statusResult && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-lg mb-2">Resveration Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {statusResult.name}</p>
                    <p><span className="font-medium">Date:</span> {new Date(statusResult.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p><span className="font-medium">Time:</span> {statusResult.time}</p>
                    <p><span className="font-medium">Guests:</span> {statusResult.guests}</p>
                    <div className="mt-3 pt-3 border-t">
                      <p className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${statusResult.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          statusResult.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {statusResult.status}
                        </span>
                      </p>
                      {statusResult.table_number && (
                        <p className="mt-2 text-lg font-bold text-orange-600 text-center bg-orange-50 p-2 rounded border border-orange-100">
                          📍 Table: {statusResult.table_number}
                        </p>
                      )}
                      {!statusResult.table_number && statusResult.status === 'confirmed' && (
                        <p className="mt-2 text-gray-500 text-center text-xs">Table will be assigned upon arrival.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Existing Booking Form Header */}
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-gray-900 mb-8 text-center"
              >
                Table Reservation
              </motion.h1>

              {/* ... Rest of the existing form ... */}
              {/* Success Message */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 flex items-center"
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    <span>Your table has been reserved. We'll send you a confirmation email shortly.</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Personal Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${validationErrors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                              placeholder="farhan"
                            />
                            {validationErrors.name && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute right-3 top-3.5"
                              >
                                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                              </motion.div>
                            )}
                          </div>
                          {validationErrors.name && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm text-red-500 mt-1"
                            >
                              {validationErrors.name}
                            </motion.p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${validationErrors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                              placeholder="farhan@example.com"
                            />
                            {validationErrors.email && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute right-3 top-3.5"
                              >
                                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                              </motion.div>
                            )}
                          </div>
                          {validationErrors.email && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm text-red-500 mt-1"
                            >
                              {validationErrors.email}
                            </motion.p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Phone Number
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'
                                }`}
                              placeholder="+923123456789"
                            />
                            {validationErrors.phone && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute right-3 top-3.5"
                              >
                                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                              </motion.div>
                            )}
                          </div>
                          {validationErrors.phone && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm text-red-500 mt-1"
                            >
                              {validationErrors.phone}
                            </motion.p>
                          )}
                        </div>
                      </div>

                      {/* Reservation Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Date
                          </label>
                          <div className="relative">
                            <input
                              ref={dateInputRef}
                              type="date"
                              name="date"
                              value={formData.date}
                              onChange={handleChange}
                              required
                              // Use local date string for min attribute to avoid timezone issues
                              min={new Date().toLocaleDateString('en-CA')}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${validationErrors.date ? 'border-red-500' : 'border-gray-300'
                                }`}
                            />
                            <CalendarIcon
                              className="h-5 w-5 text-gray-400 absolute right-3 top-3.5 cursor-pointer hover:text-orange-500"
                              onClick={() => dateInputRef.current?.showPicker()}
                            />
                          </div>
                          {validationErrors.date && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm text-red-500 mt-1"
                            >
                              {validationErrors.date}
                            </motion.p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Number of Guests
                          </label>
                          <div className="relative">
                            <select
                              name="guests"
                              value={formData.guests}
                              onChange={handleChange}
                              required
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors appearance-none ${validationErrors.guests ? 'border-red-500' : 'border-gray-300'
                                }`}
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                              ))}
                            </select>
                            <UserGroupIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3.5" />
                          </div>
                          {validationErrors.guests && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm text-red-500 mt-1"
                            >
                              {validationErrors.guests}
                            </motion.p>
                          )}
                        </div>
                      </div>

                      {/* Table Availability */}
                      {formData.date && formData.guests && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium text-gray-900">Available Time Slots</h3>
                          {isCheckingAvailability ? (
                            <div className="text-center py-4">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                              <p className="mt-2 text-gray-600">Checking availability...</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {tableAvailability.map((slot) => (
                                <motion.button
                                  key={slot.time}
                                  type="button"
                                  onClick={() => setFormData(prev => ({ ...prev, time: slot.time }))}
                                  disabled={!slot.available}
                                  whileHover={slot.available ? { scale: 1.02 } : {}}
                                  whileTap={slot.available ? { scale: 0.98 } : {}}
                                  className={`p-4 rounded-lg border transition-all ${formData.time === slot.time
                                    ? 'border-orange-500 bg-orange-50'
                                    : slot.available
                                      ? 'border-gray-200 hover:border-orange-500 hover:bg-orange-50'
                                      : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                    }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{slot.time}</span>
                                    {slot.available ? (
                                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <XCircleIcon className="h-5 w-5 text-red-500" />
                                    )}
                                  </div>
                                  {slot.available && (
                                    <p className="text-sm text-gray-600 mt-1">
                                      {slot.remainingTables} tables left
                                    </p>
                                  )}
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Special Requests */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Special Requests
                        </label>
                        <div className="relative">
                          <textarea
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors h-32"
                            placeholder="Any special requests or dietary requirements?"
                          />
                          <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3.5" />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <motion.button
                          type="submit"
                          disabled={isSubmitting || !isFormValid}
                          whileHover={isFormValid ? { scale: 1.02 } : {}}
                          whileTap={isFormValid ? { scale: 0.98 } : {}}
                          className={`px-8 py-4 bg-orange-500 text-white rounded-lg transition-colors ${(isSubmitting || !isFormValid) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'
                            }`}
                        >
                          {isSubmitting ? 'Reserving...' : 'Reserve Table'}
                        </motion.button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-1">
                  <PreviewPanel />
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal />
    </div>
  );
};
export default Reservation; 