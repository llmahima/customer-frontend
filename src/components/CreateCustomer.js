import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API_URL from '../config/api';



function CreateCustomer() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    address_line: '',
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

    if (!formData.address_line.trim()) {
      newErrors.address_line = 'Address line is required';
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
          address_line: '',
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
    <div className="bg-white p-5 rounded border border-gray-200 mb-5">
      <div className="mb-6">
        <h2 className="text-gray-900 text-lg font-semibold mb-1">Create New Customer</h2>
        <p className="text-sm text-gray-600">Fill in the details below to add a new customer</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        {/* Personal Information Section */}
        <div className="mb-6">
          <h3 className="text-gray-900 text-base font-semibold mb-4 pb-2 border-b border-gray-200">
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
                className={`w-full p-2 border rounded text-sm focus:outline-none focus:border-gray-500 ${
                  errors.first_name ? 'border-red-500' : 'border-gray-300'
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
                className={`w-full p-2 border rounded text-sm focus:outline-none focus:border-gray-500 ${
                  errors.last_name ? 'border-red-500' : 'border-gray-300'
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
                className={`w-full p-2 border rounded text-sm focus:outline-none focus:border-gray-500 ${
                  errors.phone_number ? 'border-red-500' : 'border-gray-300'
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
        <div className="mb-6">
          <h3 className="text-gray-900 text-base font-semibold mb-4 pb-2 border-b border-gray-200">
            Address Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="md:col-span-2">
              <label className="block mb-3 text-sm sm:text-base font-medium text-gray-700">
                Address Line <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address_line"
                value={formData.address_line}
                onChange={handleChange}
                className={`w-full p-2 border rounded text-sm focus:outline-none focus:border-gray-500 ${
                  errors.address_line ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter address line"
              />
              {errors.address_line && (
                <div className="text-red-500 text-xs sm:text-sm mt-1.5 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.address_line}
                </div>
              )}
            </div>
            <div>
              <label className="block mb-3 text-sm sm:text-base font-medium text-gray-700">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full p-2 border rounded text-sm focus:outline-none focus:border-gray-500 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
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
                className={`w-full p-2 border rounded text-sm focus:outline-none focus:border-gray-500 ${
                  errors.state ? 'border-red-500' : 'border-gray-300'
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
                className={`w-full p-2 border rounded text-sm focus:outline-none focus:border-gray-500 ${
                  errors.pin_code ? 'border-red-500' : 'border-gray-300'
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
        <div className="flex gap-2 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded hover:bg-gray-800 transition-colors"
          >
            Create Customer
          </button>
          <button
            type="button"
            onClick={() => navigate('/customers/all')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateCustomer;

