import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MedCare
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Find Doctors</Link>
          </li>
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Hospitals</Link>
          </li>
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Medicines</Link>
          </li>
          <li className="navbar-item">
            <Link to="/my-bookings" className="navbar-link">My Bookings</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

