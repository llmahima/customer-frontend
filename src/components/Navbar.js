import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-slate-700 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 py-4">
        <div className="flex justify-between items-center">
          {/* Left side - Logo/Title */}
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Customer Management System</h1>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex gap-4">
            <Link
              to="/"
              className={`px-4 py-2 rounded transition-colors ${
                location.pathname === '/'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-600 text-white hover:bg-slate-500'
              }`}
            >
              Home
            </Link>
            <Link
              to="/customers/all"
              className={`px-4 py-2 rounded transition-colors ${
                location.pathname === '/customers/all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-600 text-white hover:bg-slate-500'
              }`}
            >
              Customer List
            </Link>
            <Link
              to="/customers/new"
              className={`px-4 py-2 rounded transition-colors ${
                location.pathname === '/customers/new'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-600 text-white hover:bg-slate-500'
              }`}
            >
              Create Customer
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded hover:bg-slate-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2 rounded transition-colors ${
                location.pathname === '/'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-600 text-white hover:bg-slate-500'
              }`}
            >
              Home
            </Link>
            <Link
              to="/customers/all"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2 rounded transition-colors ${
                location.pathname === '/customers/all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-600 text-white hover:bg-slate-500'
              }`}
            >
              Customer List
            </Link>
            <Link
              to="/customers/new"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2 rounded transition-colors ${
                location.pathname === '/customers/new'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-600 text-white hover:bg-slate-500'
              }`}
            >
              Create Customer
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

