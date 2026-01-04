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
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    if (!addressForm.address_line || !addressForm.city || !addressForm.state || !addressForm.pin_code) {
      toast.error('All address fields are required');
      return;
    }

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
    return <div className="bg-white p-5 rounded-lg shadow mb-5">Loading...</div>;
  }

  if (!customer) {
    return <div className="bg-white p-5 rounded-lg shadow mb-5">Customer not found</div>;
  }

  return (
    <div>
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg mb-5">
        <div className="mb-6">
          <h2 className="text-slate-700 text-xl sm:text-2xl md:text-3xl font-bold mb-2">Customer Details</h2>
          <p className="text-gray-500 text-sm sm:text-base">View and manage customer information</p>
        </div>
        
        {!editingCustomer ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">First Name</p>
                <p className="text-sm sm:text-base font-semibold text-gray-800">{customer.first_name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Last Name</p>
                <p className="text-sm sm:text-base font-semibold text-gray-800">{customer.last_name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Phone Number</p>
                <p className="text-sm sm:text-base font-semibold text-gray-800">{customer.phone_number}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">City</p>
                <p className="text-sm sm:text-base font-semibold text-gray-800">{customer.city}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">State</p>
                <p className="text-sm sm:text-base font-semibold text-gray-800">{customer.state}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">Pin Code</p>
                <p className="text-sm sm:text-base font-semibold text-gray-800">{customer.pin_code}</p>
              </div>
            </div>
            <button
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all transform hover:scale-105 text-sm sm:text-base flex items-center justify-center gap-2"
              onClick={() => setEditingCustomer(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Customer
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomerUpdate} className="max-w-4xl">
            <div className="mb-6">
              <h3 className="text-slate-600 text-base sm:text-lg font-semibold mb-4 pb-2 border-b border-gray-200">
                Edit Customer Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6">
              <div>
                <label className="block mb-2 text-sm sm:text-base font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerForm.first_name}
                  onChange={(e) => setCustomerForm({ ...customerForm, first_name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="Enter first name"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm sm:text-base font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customerForm.last_name}
                  onChange={(e) => setCustomerForm({ ...customerForm, last_name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="Enter last name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm sm:text-base font-medium text-gray-700">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={customerForm.phone_number}
                  onChange={(e) => setCustomerForm({ ...customerForm, phone_number: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="Enter phone number (min. 10 digits)"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-all transform hover:scale-105 text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Update Customer
              </button>
              <button
                type="button"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition-all text-sm sm:text-base"
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

      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-lg mb-5">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
          <div>
            <h2 className="text-slate-700 text-xl sm:text-2xl md:text-3xl font-bold mb-2">Addresses</h2>
            <div className="flex items-center gap-2">
              {addresses.length === 0 && (
                <span className="inline-block px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs sm:text-sm font-medium">
                  No Addresses
                </span>
              )}
              {addresses.length === 1 && (
                <span className="inline-block px-3 py-1 bg-blue-500 text-white rounded-full text-xs sm:text-sm font-medium">
                  Single Address
                </span>
              )}
              {addresses.length > 1 && (
                <span className="inline-block px-3 py-1 bg-blue-500 text-white rounded-full text-xs sm:text-sm font-medium">
                  Multiple Addresses ({addresses.length})
                </span>
              )}
            </div>
          </div>
          <button
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-all transform hover:scale-105 text-sm sm:text-base flex items-center justify-center gap-2"
            onClick={() => {
              setShowAddAddress(true);
              setEditingAddress(null);
              setAddressForm({ address_line: '', city: '', state: '', pin_code: '' });
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Address
          </button>
        </div>

        {showAddAddress && (
          <form onSubmit={handleAddressSubmit} className="mb-5 p-5 sm:p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="mb-5 text-base sm:text-lg font-semibold text-slate-700 pb-2 border-b border-gray-300">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6">
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm sm:text-base font-medium text-gray-700">
                  Address Line <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addressForm.address_line}
                  onChange={(e) => setAddressForm({ ...addressForm, address_line: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="Enter address line"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm sm:text-base font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm sm:text-base font-medium text-gray-700">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="Enter state"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm sm:text-base font-medium text-gray-700">
                  Pin Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addressForm.pin_code}
                  onChange={(e) => setAddressForm({ ...addressForm, pin_code: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm sm:text-base transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="Enter pin code"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-300">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-all transform hover:scale-105 text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingAddress ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
                </svg>
                {editingAddress ? 'Update Address' : 'Add Address'}
              </button>
              <button
                type="button"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition-all text-sm sm:text-base"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {addresses.map(address => (
              <div key={address.id} className="bg-gray-50 p-5 rounded-lg border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-slate-700 text-base sm:text-lg font-semibold">Address #{address.id}</h4>
                </div>
                <div className="space-y-2.5 mb-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-0.5">Address Line</p>
                    <p className="text-sm sm:text-base font-medium text-gray-800">{address.address_line}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-0.5">City</p>
                      <p className="text-sm sm:text-base font-medium text-gray-800">{address.city}</p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-0.5">State</p>
                      <p className="text-sm sm:text-base font-medium text-gray-800">{address.state}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-0.5">Pin Code</p>
                    <p className="text-sm sm:text-base font-medium text-gray-800">{address.pin_code}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 pt-3 border-t border-gray-200">
                  <button
                    className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 border-none rounded-lg cursor-pointer text-sm transition-all bg-blue-500 text-white hover:bg-blue-600 font-medium"
                    onClick={() => handleEditAddress(address)}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 border-none rounded-lg cursor-pointer text-sm transition-all bg-red-500 text-white hover:bg-red-600 font-medium"
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
        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3.5 bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition-all text-sm sm:text-base flex items-center justify-center gap-2"
        onClick={() => navigate('/customers/all')}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Customer List
      </button>
    </div>
  );
}

export default CustomerDetails;

