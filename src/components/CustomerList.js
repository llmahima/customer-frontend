import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API_URL from '../config/api';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [filterInputs, setFilterInputs] = useState({ city: '', state: '', pin_code: '' }); // What user types
  const [appliedFilters, setAppliedFilters] = useState({ city: '', state: '', pin_code: '' }); // What triggers API
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
  }, [currentPage, appliedFilters.city, appliedFilters.state, appliedFilters.pin_code]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', pagination.limit);
      
      if (appliedFilters.city) params.append('city', appliedFilters.city);
      if (appliedFilters.state) params.append('state', appliedFilters.state);
      if (appliedFilters.pin_code) params.append('pin_code', appliedFilters.pin_code);

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

  const handleFilterInputChange = (e) => {
    const { name, value } = e.target;
    setFilterInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    setAppliedFilters({ ...filterInputs });
    setCurrentPage(1); // Reset to first page when searching
  };

  const clearFilters = () => {
    setFilterInputs({ city: '', state: '', pin_code: '' });
    setAppliedFilters({ city: '', state: '', pin_code: '' });
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
    return (
      <div className="bg-white p-5 rounded border border-gray-200 mb-5">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600 text-sm">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white p-5 rounded border border-gray-200 mb-5">
        <h2 className="text-gray-900 text-lg font-semibold mb-4">Search & Filter Customers</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            name="city"
            placeholder="Search by City"
            value={filterInputs.city}
            onChange={handleFilterInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
          />
          <input
            type="text"
            name="state"
            placeholder="Search by State"
            value={filterInputs.state}
            onChange={handleFilterInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
          />
          <input
            type="text"
            name="pin_code"
            placeholder="Search by Pin Code"
            value={filterInputs.pin_code}
            onChange={handleFilterInputChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
          />
          <button 
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded hover:bg-gray-800 transition-colors whitespace-nowrap" 
            onClick={handleSearch}
          >
            Search
          </button>
          <button 
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors whitespace-nowrap" 
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded border border-gray-200 mb-5">
        <div className="mb-4">
          <h2 className="text-gray-900 text-lg font-semibold mb-1">
            Customer List
          </h2>
          <p className="text-sm text-gray-600">
            Total: {pagination.totalCount} customers
          </p>
        </div>
        {customers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-600 text-base sm:text-lg font-medium">No customers found.</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or add a new customer.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {customers.map(customer => (
                <div key={customer.id} className="bg-white p-5 rounded border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-2 text-lg font-semibold">{customer.first_name} {customer.last_name}</h3>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
                        <span><strong>Phone:</strong> {customer.phone_number}</span>
                        {customer.city && customer.state && (
                          <span><strong>Location:</strong> {customer.city}, {customer.state}</span>
                        )}
                        {customer.pin_code && (
                          <span><strong>Pin Code:</strong> {customer.pin_code}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        onClick={() => navigate(`/customers/${customer.id}`)}
                      >
                        View Details
                      </button>
                      <button
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                        onClick={() => handleDelete(customer.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-medium text-gray-900">{((currentPage - 1) * pagination.limit) + 1}</span> to <span className="font-medium text-gray-900">{Math.min(currentPage * pagination.limit, pagination.totalCount)}</span> of <span className="font-medium text-gray-900">{pagination.totalCount}</span> customers
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className={`px-3 py-2 text-sm font-medium rounded border transition-colors ${
                        pagination.hasPrevPage
                          ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                          : 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
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
                            className={`px-3 py-2 text-sm font-medium rounded border transition-colors ${
                              currentPage === pageNum
                                ? 'text-white bg-gray-900 border-gray-900'
                                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
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
                      className={`px-3 py-2 text-sm font-medium rounded border transition-colors ${
                        pagination.hasNextPage
                          ? 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                          : 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      Next
                    </button>
                  </div>
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

