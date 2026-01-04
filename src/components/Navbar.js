import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-slate-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-5 py-4">
        <div className="flex justify-between items-center">
          {/* Left side - Logo/Title */}
          <div>
            <h1 className="text-2xl font-bold">Customer Management System</h1>
          </div>

          {/* Right side - Navigation Links */}
          <div className="flex gap-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded transition-colors ${
                location.pathname === '/'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-600 text-white hover:bg-slate-500'
              }`}
            >
              Customer List
            </Link>
            <Link
              to="/create"
              className={`px-4 py-2 rounded transition-colors ${
                location.pathname === '/create'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-600 text-white hover:bg-slate-500'
              }`}
            >
              Create Customer
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

