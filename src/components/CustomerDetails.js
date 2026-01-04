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
    return <div className="card">Loading...</div>;
  }

  if (!customer) {
    return <div className="card">Customer not found</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>Customer Details</h2>
        
        {!editingCustomer ? (
          <div>
            <p><strong>First Name:</strong> {customer.first_name}</p>
            <p><strong>Last Name:</strong> {customer.last_name}</p>
            <p><strong>Phone Number:</strong> {customer.phone_number}</p>
            <p><strong>City:</strong> {customer.city}</p>
            <p><strong>State:</strong> {customer.state}</p>
            <p><strong>Pin Code:</strong> {customer.pin_code}</p>
            <button
              className="btn btn-primary"
              onClick={() => setEditingCustomer(true)}
              style={{ marginTop: '15px' }}
            >
              Edit Customer
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomerUpdate}>
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                value={customerForm.first_name}
                onChange={(e) => setCustomerForm({ ...customerForm, first_name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                value={customerForm.last_name}
                onChange={(e) => setCustomerForm({ ...customerForm, last_name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                value={customerForm.phone_number}
                onChange={(e) => setCustomerForm({ ...customerForm, phone_number: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-success">
              Update Customer
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEditingCustomer(false);
                setCustomerForm({
                  first_name: customer.first_name,
                  last_name: customer.last_name,
                  phone_number: customer.phone_number
                });
              }}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>
            Addresses
            {addresses.length === 1 && <span className="address-badge">Single Address</span>}
            {addresses.length > 1 && <span className="address-badge">Multiple Addresses ({addresses.length})</span>}
          </h2>
          <button
            className="btn btn-success"
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
          <form onSubmit={handleAddressSubmit} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
            <div className="form-group">
              <label>Address Line *</label>
              <input
                type="text"
                value={addressForm.address_line}
                onChange={(e) => setAddressForm({ ...addressForm, address_line: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Pin Code *</label>
              <input
                type="text"
                value={addressForm.pin_code}
                onChange={(e) => setAddressForm({ ...addressForm, pin_code: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-success">
              {editingAddress ? 'Update Address' : 'Add Address'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowAddAddress(false);
                setEditingAddress(null);
                setAddressForm({ address_line: '', city: '', state: '', pin_code: '' });
              }}
              style={{ marginLeft: '10px' }}
            >
              Cancel
            </button>
          </form>
        )}

        {addresses.length === 0 ? (
          <p>No addresses found. Add an address to get started.</p>
        ) : (
          <div className="address-list">
            {addresses.map(address => (
              <div key={address.id} className="address-item">
                <h4>Address #{address.id}</h4>
                <p><strong>Address Line:</strong> {address.address_line}</p>
                <p><strong>City:</strong> {address.city}</p>
                <p><strong>State:</strong> {address.state}</p>
                <p><strong>Pin Code:</strong> {address.pin_code}</p>
                <div className="address-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditAddress(address)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
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

      <button className="btn btn-secondary" onClick={() => navigate('/')}>
        Back to Customer List
      </button>
    </div>
  );
}

export default CustomerDetails;

