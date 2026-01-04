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
    <div className="bg-white p-4 sm:p-5 rounded-lg shadow mb-5">
      <h2 className="mb-4 sm:mb-5 text-slate-700 text-lg sm:text-xl font-semibold">Create New Customer</h2>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="mb-4 sm:mb-5">
          <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">First Name *</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.first_name && <div className="text-red-500 text-xs mt-1">{errors.first_name}</div>}
        </div>

        <div className="mb-4 sm:mb-5">
          <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">Last Name *</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.last_name && <div className="text-red-500 text-xs mt-1">{errors.last_name}</div>}
        </div>

        <div className="mb-4 sm:mb-5">
          <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">Phone Number *</label>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.phone_number && <div className="text-red-500 text-xs mt-1">{errors.phone_number}</div>}
        </div>

        <div className="mb-4 sm:mb-5">
          <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.city && <div className="text-red-500 text-xs mt-1">{errors.city}</div>}
        </div>

        <div className="mb-4 sm:mb-5">
          <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">State *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.state && <div className="text-red-500 text-xs mt-1">{errors.state}</div>}
        </div>

        <div className="mb-4 sm:mb-5">
          <label className="block mb-1 text-sm sm:text-base font-medium text-gray-700">Pin Code *</label>
          <input
            type="text"
            name="pin_code"
            value={formData.pin_code}
            onChange={handleChange}
            className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
          />
          {errors.pin_code && <div className="text-red-500 text-xs mt-1">{errors.pin_code}</div>}
        </div>

        <button type="submit" className="w-full sm:w-auto px-6 sm:px-5 py-2.5 border-none rounded cursor-pointer text-sm transition-colors bg-green-500 text-white hover:bg-green-600">
          Create Customer
        </button>
      </form>
    </div>
  );
}

export default CreateCustomer;

