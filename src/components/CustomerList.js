import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API_URL from '../config/api';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [filters, setFilters] = useState({ city: '', state: '', pin_code: '' });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters.city, filters.state, filters.pin_code]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', pagination.limit);
      
      if (filters.city) params.append('city', filters.city);
      if (filters.state) params.append('state', filters.state);
      if (filters.pin_code) params.append('pin_code', filters.pin_code);

      const response = await fetch(`${API_URL}/customers?${params.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        setCustomers(data.customers || []);
        setPagination(data.pagination || pagination);
      } else {
        toast.error(data.error || 'Error loading customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Error loading customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const clearFilters = () => {
    setFilters({ city: '', state: '', pin_code: '' });
    setCurrentPage(1);
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
        
        // Optimize: Remove from state immediately for instant UI update
        setCustomers(prevCustomers => {
          const updated = prevCustomers.filter(c => c.id !== id);
          
          // If current page becomes empty and not on first page, go to previous page
          if (updated.length === 0 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            return updated;
          }
          
          return updated;
        });
        
        // Refresh to update pagination info and ensure consistency
        setTimeout(() => {
          fetchCustomers();
        }, 100);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Error deleting customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Error deleting customer. Please try again.');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="bg-white p-5 rounded-lg shadow mb-5">Loading...</div>;
  }

  return (
    <div>
      <div className="bg-white p-4 sm:p-5 rounded-lg shadow mb-5">
        <h2 className="mb-4 sm:mb-5 text-slate-700 text-lg sm:text-xl font-semibold">Search & Filter Customers</h2>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5">
          <input
            type="text"
            name="city"
            placeholder="Search by City"
            value={filters.city}
            onChange={handleFilterChange}
            className="flex-1 w-full sm:min-w-[200px] p-2.5 border border-gray-300 rounded text-sm"
          />
          <input
            type="text"
            name="state"
            placeholder="Search by State"
            value={filters.state}
            onChange={handleFilterChange}
            className="flex-1 w-full sm:min-w-[200px] p-2.5 border border-gray-300 rounded text-sm"
          />
          <input
            type="text"
            name="pin_code"
            placeholder="Search by Pin Code"
            value={filters.pin_code}
            onChange={handleFilterChange}
            className="flex-1 w-full sm:min-w-[200px] p-2.5 border border-gray-300 rounded text-sm"
          />
          <button 
            className="w-full sm:w-auto px-5 py-2.5 border-none rounded cursor-pointer text-sm transition-colors bg-gray-400 text-white hover:bg-gray-500 whitespace-nowrap" 
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-5 rounded-lg shadow mb-5">
        <h2 className="mb-4 sm:mb-5 text-slate-700 text-lg sm:text-xl font-semibold">
          Customer List ({pagination.totalCount})
        </h2>
        {customers.length === 0 ? (
          <p className="text-gray-600">No customers found.</p>
        ) : (
          <>
            <div className="grid gap-4 mb-6">
              {customers.map(customer => (
                <div key={customer.id} className="bg-white p-4 sm:p-5 rounded-lg shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-slate-700 mb-2 text-base sm:text-lg font-semibold">{customer.first_name} {customer.last_name}</h3>
                    <p className="text-gray-500 my-1 text-sm sm:text-base">Phone: {customer.phone_number}</p>
                    <p className="text-gray-500 my-1 text-sm sm:text-base">City: {customer.city}, State: {customer.state}, Pin: {customer.pin_code}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 w-full sm:w-auto">
                    <button
                      className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 border-none rounded cursor-pointer text-sm transition-colors bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => navigate(`/customers/${customer.id}`)}
                    >
                      View Details
                    </button>
                    <button
                      className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 border-none rounded cursor-pointer text-sm transition-colors bg-red-500 text-white hover:bg-red-600"
                      onClick={() => handleDelete(customer.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} customers
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className={`px-4 py-2 rounded text-sm transition-colors ${
                      pagination.hasPrevPage
                        ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded text-sm transition-colors ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`px-4 py-2 rounded text-sm transition-colors ${
                      pagination.hasNextPage
                        ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CustomerList;

