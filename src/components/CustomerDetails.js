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
      <div className="bg-white p-5 rounded-lg shadow mb-5">
        <h2 className="mb-5 text-slate-700 text-xl font-semibold">Customer Details</h2>
        
        {!editingCustomer ? (
          <div>
            <p className="my-2"><strong>First Name:</strong> {customer.first_name}</p>
            <p className="my-2"><strong>Last Name:</strong> {customer.last_name}</p>
            <p className="my-2"><strong>Phone Number:</strong> {customer.phone_number}</p>
            <p className="my-2"><strong>City:</strong> {customer.city}</p>
            <p className="my-2"><strong>State:</strong> {customer.state}</p>
            <p className="my-2"><strong>Pin Code:</strong> {customer.pin_code}</p>
            <button
              className="px-5 py-2.5 border-none rounded cursor-pointer text-sm transition-colors bg-blue-500 text-white hover:bg-blue-600 mt-4"
              onClick={() => setEditingCustomer(true)}
            >
              Edit Customer
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomerUpdate}>
            <div className="mb-5">
              <label className="block mb-1 font-medium text-gray-700">First Name *</label>
              <input
                type="text"
                value={customerForm.first_name}
                onChange={(e) => setCustomerForm({ ...customerForm, first_name: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-1 font-medium text-gray-700">Last Name *</label>
              <input
                type="text"
                value={customerForm.last_name}
                onChange={(e) => setCustomerForm({ ...customerForm, last_name: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-1 font-medium text-gray-700">Phone Number *</label>
              <input
                type="tel"
                value={customerForm.phone_number}
                onChange={(e) => setCustomerForm({ ...customerForm, phone_number: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <button type="submit" className="px-5 py-2.5 border-none rounded cursor-pointer text-sm transition-colors bg-green-500 text-white hover:bg-green-600">
              Update Customer
            </button>
            <button
              type="button"
              className="px-5 py-2.5 border-none rounded cursor-pointer text-sm transition-colors bg-gray-400 text-white hover:bg-gray-500 ml-2.5"
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
          </form>
        )}
      </div>

      <div className="bg-white p-5 rounded-lg shadow mb-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-slate-700 text-xl font-semibold">
            Addresses
            {addresses.length === 1 && (
              <span className="inline-block px-2 py-1 bg-blue-500 text-white rounded text-xs ml-2.5">
                Single Address
              </span>
            )}
            {addresses.length > 1 && (
              <span className="inline-block px-2 py-1 bg-blue-500 text-white rounded text-xs ml-2.5">
                Multiple Addresses ({addresses.length})
              </span>
            )}
          </h2>
          <button
            className="px-5 py-2.5 border-none rounded cursor-pointer text-sm transition-colors bg-green-500 text-white hover:bg-green-600"
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
          <form onSubmit={handleAddressSubmit} className="mb-5 p-4 bg-gray-50 rounded">
            <h3 className="mb-4 text-lg font-semibold">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
            <div className="mb-5">
              <label className="block mb-1 font-medium text-gray-700">Address Line *</label>
              <input
                type="text"
                value={addressForm.address_line}
                onChange={(e) => setAddressForm({ ...addressForm, address_line: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-1 font-medium text-gray-700">City *</label>
              <input
                type="text"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-1 font-medium text-gray-700">State *</label>
              <input
                type="text"
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-1 font-medium text-gray-700">Pin Code *</label>
              <input
                type="text"
                value={addressForm.pin_code}
                onChange={(e) => setAddressForm({ ...addressForm, pin_code: e.target.value })}
                className="w-full p-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <button type="submit" className="px-5 py-2.5 border-none rounded cursor-pointer text-sm transition-colors bg-green-500 text-white hover:bg-green-600">
              {editingAddress ? 'Update Address' : 'Add Address'}
            </button>
            <button
              type="button"
              className="px-5 py-2.5 border-none rounded cursor-pointer text-sm transition-colors bg-gray-400 text-white hover:bg-gray-500 ml-2.5"
              onClick={() => {
                setShowAddAddress(false);
                setEditingAddress(null);
                setAddressForm({ address_line: '', city: '', state: '', pin_code: '' });
              }}
            >
              Cancel
            </button>
          </form>
        )}

        {addresses.length === 0 ? (
          <p>No addresses found. Add an address to get started.</p>
        ) : (
          <div className="mt-5">
            {addresses.map(address => (
              <div key={address.id} className="bg-gray-50 p-4 rounded mb-4 border-l-4 border-blue-500">
                <h4 className="text-slate-700 mb-2.5 text-lg font-semibold">Address #{address.id}</h4>
                <p className="my-1"><strong>Address Line:</strong> {address.address_line}</p>
                <p className="my-1"><strong>City:</strong> {address.city}</p>
                <p className="my-1"><strong>State:</strong> {address.state}</p>
                <p className="my-1"><strong>Pin Code:</strong> {address.pin_code}</p>
                <div className="mt-2.5 flex gap-2.5">
                  <button
                    className="px-5 py-2.5 border-none rounded cursor-pointer text-sm transition-colors bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => handleEditAddress(address)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-5 py-2.5 border-none rounded cursor-pointer text-sm transition-colors bg-red-500 text-white hover:bg-red-600"
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

      <button className="px-5 py-2.5 border-none rounded cursor-pointer text-sm transition-colors bg-gray-400 text-white hover:bg-gray-500" onClick={() => navigate('/customers/all')}>
        Back to Customer List
      </button>
    </div>
  );
}

export default CustomerDetails;

