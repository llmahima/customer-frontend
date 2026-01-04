import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CustomerList from './components/CustomerList';
import CreateCustomer from './components/CreateCustomer';
import CustomerDetails from './components/CustomerDetails';

function App() {
  return (
    <Router>
      <div className="max-w-6xl mx-auto px-5 py-5 bg-gray-100 min-h-screen">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#27ae60',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#e74c3c',
                secondary: '#fff',
              },
            },
          }}
        />
        <div className="bg-slate-700 text-white p-5 mb-8 rounded-lg">
          <h1 className="mb-2.5 text-2xl font-bold">Customer Management System</h1>
          <nav className="flex gap-4 mt-4">
            <Link to="/" className="text-white no-underline px-4 py-2 bg-slate-600 rounded transition-colors hover:bg-slate-800">
              Customer List
            </Link>
            <Link to="/create" className="text-white no-underline px-4 py-2 bg-slate-600 rounded transition-colors hover:bg-slate-800">
              Create Customer
            </Link>
          </nav>
        </div>

        <Routes>
          <Route path="/" element={<CustomerList />} />
          <Route path="/create" element={<CreateCustomer />} />
          <Route path="/customer/:id" element={<CustomerDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

