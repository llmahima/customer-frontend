import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import CustomerList from './components/CustomerList';
import CreateCustomer from './components/CreateCustomer';
import CustomerDetails from './components/CustomerDetails';

function App() {
  return (
    <Router>
      <div className="container">
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
        <div className="header">
          <h1>Customer Management System</h1>
          <nav className="nav">
            <Link to="/">Customer List</Link>
            <Link to="/create">Create Customer</Link>
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

