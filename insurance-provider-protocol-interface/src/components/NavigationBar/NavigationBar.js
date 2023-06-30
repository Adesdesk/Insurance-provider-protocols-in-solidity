import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed right-0 text-white top-0 bg-black rounded p-4">
      <div className="sm:hidden">
        <button
          className="text-white p-2 rounded focus:outline-none focus:bg-gray-700"
          onClick={handleMenuToggle}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>
      <ul
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } sm:flex sm:space-x-4 sm:space-y-0 mt-4 sm:mt-0`}
      >
        <li className={`${location.pathname === '/' ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500' : ''} rounded`}>
          <Link to="/">Home</Link>
        </li>
        <li className={`${location.pathname === '/insure-a-wallet' ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500' : ''} rounded`}>
          <Link to="/">Insure Wallet</Link>
        </li>
        <li className={`${location.pathname === '/insure-loan-collateral' ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500' : ''} rounded`}>
          <Link to="/">Insure Collateral</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
