import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API_URL from '../config/api';

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCustomer, setEditingCustomer] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [isUpdatingCustomer, setIsUpdatingCustomer] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const [customerForm, setCustomerForm] = useState({
    first_name: '',
    last_name: '',
    phone_number: ''
  });

  const [addressForm, setAddressForm] = useState({
    address_line: '',
    city: '',
    state: '',
    pin_code: ''
  });

  useEffect(() => {
    fetchCustomerDetails();
    fetchAddresses();
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/customers/${id}`);
      const data = await response.json();
      if (response.ok) {
        setCustomer(data);
        setCustomerForm({
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number
        });
      } else {
        toast.error(data.error || 'Error loading customer details');
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
      toast.error('Error loading customer details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${API_URL}/customers/${id}/addresses`);
      const data = await response.json();
      if (response.ok) {
        setAddresses(data);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Error loading addresses');
    }
  };

  const handleCustomerUpdate = async (e) => {
    e.preventDefault();

    if (!customerForm.first_name || !customerForm.last_name || !customerForm.phone_number) {
      toast.error('All fields are required');
      return;
    }

    if (customerForm.phone_number.length < 10) {
      toast.error('Phone number must be at least 10 digits');
      return;
    }

    setIsUpdatingCustomer(true);
    try {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerForm)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Customer updated successfully!');
        setEditingCustomer(false);
        fetchCustomerDetails();
      } else {
        toast.error(data.error || 'Error updating customer');
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Error updating customer. Please try again.');
    } finally {
      setIsUpdatingCustomer(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    if (!addressForm.address_line || !addressForm.city || !addressForm.state || !addressForm.pin_code) {
      toast.error('All address fields are required');
      return;
    }

    setIsSavingAddress(true);
    try {
      const url = editingAddress
        ? `${API_URL}/addresses/${editingAddress}`
        : `${API_URL}/customers/${id}/addresses`;
      const method = editingAddress ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressForm)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(editingAddress ? 'Address updated successfully!' : 'Address added successfully!');
        setShowAddAddress(false);
        setEditingAddress(null);
        setAddressForm({ address_line: '', city: '', state: '', pin_code: '' });
        fetchAddresses();
      } else {
        toast.error(data.error || 'Error saving address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Error saving address. Please try again.');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address.id);
    setAddressForm({
      address_line: address.address_line,
      city: address.city,
      state: address.state,
      pin_code: address.pin_code
    });
    setShowAddAddress(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/addresses/${addressId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Address deleted successfully!');
        fetchAddresses();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Error deleting address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Error deleting address. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-5 rounded border border-gray-200 mb-5">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600 text-sm">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="bg-white p-5 rounded border border-gray-200 mb-5">
        <p className="text-gray-600">Customer not found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white p-5 rounded border border-gray-200 mb-5">
        <div className="mb-4">
          <h2 className="text-gray-900 text-lg font-semibold mb-1">Customer Details</h2>
          <p className="text-sm text-gray-600">View and manage customer information</p>
        </div>
        
        {!editingCustomer ? (
          <div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-4 py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600 w-32">First Name:</span>
                <span className="text-base font-medium text-gray-900">{customer.first_name}</span>
              </div>
              <div className="flex items-center gap-4 py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600 w-32">Last Name:</span>
                <span className="text-base font-medium text-gray-900">{customer.last_name}</span>
              </div>
              <div className="flex items-center gap-4 py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600 w-32">Phone Number:</span>
                <span className="text-base font-medium text-gray-900">{customer.phone_number}</span>
              </div>
            </div>
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              onClick={() => setEditingCustomer(true)}
            >
              Edit Customer
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomerUpdate} className="max-w-5xl mx-auto">
            <div className="mb-6">
              <h3 className="text-slate-600 text-base sm:text-lg font-semibold mb-6 pb-2 border-b border-gray-200">
                Edit Customer Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
              <div>
                <label className="block mb-3 text-sm sm:text-base font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerForm.first_name}
                  onChange={(e) => setCustomerForm({ ...customerForm, first_name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label className="block mb-3 text-sm sm:text-base font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerForm.last_name}
                  onChange={(e) => setCustomerForm({ ...customerForm, last_name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                  placeholder="Enter last name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-3 text-sm sm:text-base font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={customerForm.phone_number}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone_number: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                  placeholder="Enter phone number (min. 10 digits)"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isUpdatingCustomer}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUpdatingCustomer && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {isUpdatingCustomer ? 'Updating...' : 'Update Customer'}
              </button>
              <button
                type="button"
                disabled={isUpdatingCustomer}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  setEditingCustomer(false);
                  setCustomerForm({
                    first_name: customer.first_name,
                    last_name: customer.last_name,
                    phone_number: customer.phone_number
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white p-5 rounded border border-gray-200 mb-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <div>
            <h2 className="text-gray-900 text-lg font-semibold mb-1">Addresses</h2>
            <p className="text-sm text-gray-600">
              {addresses.length === 0 && 'No addresses'}
              {addresses.length === 1 && '1 address'}
              {addresses.length > 1 && `${addresses.length} addresses`}
            </p>
          </div>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded hover:bg-gray-800 transition-colors"
            onClick={() => {
              setShowAddAddress(true);
              setEditingAddress(null);
              setAddressForm({ address_line: '', city: '', state: '', pin_code: '' });
            }}
          >
            Add Address
          </button>
        </div>

        {showAddAddress && (
          <form onSubmit={handleAddressSubmit} className="mb-5 p-5 bg-white rounded border border-gray-200 max-w-5xl mx-auto">
            <h3 className="mb-6 text-base sm:text-lg font-semibold text-slate-700 pb-2 border-b border-gray-300">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
              <div className="md:col-span-2">
                <label className="block mb-3 text-sm sm:text-base font-medium text-gray-700">
                  Address Line <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addressForm.address_line}
                  onChange={(e) => setAddressForm({ ...addressForm, address_line: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                  placeholder="Enter address line"
                />
              </div>

              <div>
                <label className="block mb-3 text-sm sm:text-base font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block mb-3 text-sm sm:text-base font-medium text-gray-700">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                  placeholder="Enter state"
                />
              </div>

              <div>
                <label className="block mb-3 text-sm sm:text-base font-medium text-gray-700">
                  Pin Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addressForm.pin_code}
                  onChange={(e) => setAddressForm({ ...addressForm, pin_code: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                  placeholder="Enter pin code"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSavingAddress}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSavingAddress && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {isSavingAddress 
                  ? (editingAddress ? 'Updating...' : 'Adding...') 
                  : (editingAddress ? 'Update Address' : 'Add Address')
                }
              </button>
              <button
                type="button"
                disabled={isSavingAddress}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  setShowAddAddress(false);
                  setEditingAddress(null);
                  setAddressForm({ address_line: '', city: '', state: '', pin_code: '' });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {addresses.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-600 text-sm sm:text-base">No addresses found. Add an address to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((address, index) => (
              <div key={address.id} className="bg-white p-5 rounded border border-gray-200">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                  <h4 className="text-gray-900 text-base font-semibold">Address {index + 1}</h4>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-4 py-1">
                    <span className="text-sm text-gray-600 w-28">Address Line:</span>
                    <span className="text-sm text-gray-900">{address.address_line}</span>
                  </div>
                  <div className="flex items-start gap-4 py-1">
                    <span className="text-sm text-gray-600 w-28">City:</span>
                    <span className="text-sm text-gray-900">{address.city}</span>
                  </div>
                  <div className="flex items-start gap-4 py-1">
                    <span className="text-sm text-gray-600 w-28">State:</span>
                    <span className="text-sm text-gray-900">{address.state}</span>
                  </div>
                  <div className="flex items-start gap-4 py-1">
                    <span className="text-sm text-gray-600 w-28">Pin Code:</span>
                    <span className="text-sm text-gray-900">{address.pin_code}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t border-gray-200">
                  <button
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    onClick={() => handleEditAddress(address)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                    onClick={() => handleDeleteAddress(address.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        onClick={() => navigate('/customers/all')}
      >
        Back to Customer List
      </button>
    </div>
  );
}

export default CustomerDetails;

