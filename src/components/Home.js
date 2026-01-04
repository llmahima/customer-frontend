import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8">
      <div className="text-center w-full">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 rounded-2xl shadow-2xl mb-8 sm:mb-12 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-white opacity-10 rounded-full -mr-16 sm:-mr-24 md:-mr-32 -mt-16 sm:-mt-24 md:-mt-32"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48 bg-white opacity-10 rounded-full -ml-12 sm:-ml-18 md:-ml-24 -mb-12 sm:-mb-18 md:-mb-24"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2">
              Customer Management System
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-2xl mx-auto px-4">
              Streamline your customer relationships with our powerful CRM solution. 
              Manage contacts, addresses, and interactions all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button
                onClick={() => navigate('/customers/new')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-xl hover:bg-blue-50 transition-all transform hover:scale-105 text-base sm:text-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Customer
                </span>
              </button>
              <button
                onClick={() => navigate('/customers/all')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-500 text-white font-semibold rounded-lg shadow-xl hover:bg-blue-400 transition-all transform hover:scale-105 text-base sm:text-lg border-2 border-white"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  View All Customers
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 px-2">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Easy Management</h3>
            <p className="text-sm sm:text-base text-gray-600">Create, update, and manage customer information effortlessly with our intuitive interface.</p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Multiple Addresses</h3>
            <p className="text-sm sm:text-base text-gray-600">Store and manage multiple addresses for each customer, perfect for businesses with various locations.</p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Quick Search</h3>
            <p className="text-sm sm:text-base text-gray-600">Find customers instantly by city, state, or pin code with our powerful search and filter functionality.</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 sm:p-8 rounded-xl mx-2">
          <p className="text-gray-600 text-base sm:text-lg">
            Get started by adding your first customer or explore existing records
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;

