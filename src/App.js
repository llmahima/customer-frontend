import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="container">
        <div className="header">
          <h1>Customer Management System</h1>
          <nav className="nav">
            <Link to="/">Customer List</Link>
            <Link to="/create">Create Customer</Link>
          </nav>
        </div>
      </div>
    </Router>
  );
}

export default App;

