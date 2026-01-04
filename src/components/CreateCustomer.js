import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API_URL from '../config/api';



function CreateCustomer() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    city: '',
    state: '',
    pin_code: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (formData.phone_number.length < 10) {
      newErrors.phone_number = 'Phone number must be at least 10 digits';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.pin_code.trim()) {
      newErrors.pin_code = 'Pin code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Customer created successfully!');
        setFormData({
          first_name: '',
          last_name: '',
          phone_number: '',
          city: '',
          state: '',
          pin_code: ''
        });
        setTimeout(() => {
          navigate('/customers/all');
        }, 1500);
      } else {
        toast.error(data.error || 'Error creating customer');
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error('Error creating customer. Please try again.');
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg mb-5">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-slate-700 text-xl sm:text-2xl md:text-3xl font-bold mb-2">Create New Customer</h2>
        <p className="text-gray-500 text-sm sm:text-base">Fill in the details below to add a new customer to your system</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        {/* Personal Information Section */}
        <div className="mb-8 sm:mb-10">
          <h3 className="text-slate-600 text-base sm:text-lg font-semibold mb-6 pb-2 border-b border-gray-200">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <label className="block mb-3 text-sm sm:text-base font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`w-full p-4 border rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.first_name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder="Enter first name"
              />
              {errors.first_name && (
                <div className="text-red-500 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.first_name}
                </div>
              )}
            </div>

            <div>
              <label className="block mb-3 text-sm sm:text-base font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`w-full p-4 border rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.last_name ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder="Enter last name"
              />
              {errors.last_name && (
                <div className="text-red-500 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.last_name}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block mb-3 text-sm sm:text-base font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className={`w-full p-4 border rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone_number ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder="Enter phone number (min. 10 digits)"
              />
              {errors.phone_number && (
                <div className="text-red-500 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.phone_number}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Address Information Section */}
        <div className="mb-8 sm:mb-10">
          <h3 className="text-slate-600 text-base sm:text-lg font-semibold mb-6 pb-2 border-b border-gray-200">
            Address Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <label className="block mb-3 text-sm sm:text-base font-medium text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full p-4 border rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.city ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder="Enter city"
              />
              {errors.city && (
                <div className="text-red-500 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.city}
                </div>
              )}
            </div>

            <div>
              <label className="block mb-3 text-sm sm:text-base font-medium text-gray-700">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full p-4 border rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.state ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder="Enter state"
              />
              {errors.state && (
                <div className="text-red-500 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.state}
                </div>
              )}
            </div>

            <div>
              <label className="block mb-3 text-sm sm:text-base font-medium text-gray-700">
                Pin Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pin_code"
                value={formData.pin_code}
                onChange={handleChange}
                className={`w-full p-4 border rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.pin_code ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                }`}
                placeholder="Enter pin code"
              />
              {errors.pin_code && (
                <div className="text-red-500 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.pin_code}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-all transform hover:scale-105 text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Customer
          </button>
          <button
            type="button"
            onClick={() => navigate('/customers/all')}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition-all text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCustomer;

