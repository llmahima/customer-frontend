import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API_URL from '../config/api';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filters, setFilters] = useState({ city: '', state: '', pin_code: '' });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, customers]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.state) params.append('state', filters.state);
      if (filters.pin_code) params.append('pin_code', filters.pin_code);

      const url = params.toString() 
        ? `${API_URL}/customers?${params.toString()}`
        : `${API_URL}/customers`;

      const response = await fetch(url);
      const data = await response.json();
      setCustomers(data);
      setFilteredCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    if (!filters.city && !filters.state && !filters.pin_code) {
      setFilteredCustomers(customers);
      return;
    }

    const filtered = customers.filter(customer => {
      const matchCity = !filters.city || 
        customer.city.toLowerCase().includes(filters.city.toLowerCase());
      const matchState = !filters.state || 
        customer.state.toLowerCase().includes(filters.state.toLowerCase());
      const matchPinCode = !filters.pin_code || 
        customer.pin_code.includes(filters.pin_code);
      
      return matchCity && matchState && matchPinCode;
    });

    setFilteredCustomers(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ city: '', state: '', pin_code: '' });
    fetchCustomers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Customer deleted successfully!');
        fetchCustomers();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Error deleting customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Error deleting customer. Please try again.');
    }
  };

  if (loading) {
    return <div className="card">Loading...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2>Search & Filter Customers</h2>
        <div className="search-filters">
          <input
            type="text"
            name="city"
            placeholder="Search by City"
            value={filters.city}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="state"
            placeholder="Search by State"
            value={filters.state}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="pin_code"
            placeholder="Search by Pin Code"
            value={filters.pin_code}
            onChange={handleFilterChange}
          />
          <button className="btn btn-secondary" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Customer List ({filteredCustomers.length})</h2>
        {filteredCustomers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          <div className="customer-list">
            {filteredCustomers.map(customer => (
              <div key={customer.id} className="customer-item">
                <div className="customer-info">
                  <h3>{customer.first_name} {customer.last_name}</h3>
                  <p>Phone: {customer.phone_number}</p>
                  <p>City: {customer.city}, State: {customer.state}, Pin: {customer.pin_code}</p>
                </div>
                <div className="customer-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/customer/${customer.id}`)}
                  >
                    View Details
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(customer.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerList;

