import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import WalletConnection from '../AppPages/WalletConnection';
import InsureWallet from '../AppPages/InsureWallet';
import InsureCollateral from '../AppPages/InsureCollateral';
import AdminDashboard from '../AppPages/AdminDashboard';

const VariousRoutes = () => {
  const [wallet, setWallet] = useState(null);

  const handleWalletConnect = () => {
    setWallet(window.ethereum);
  };

  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/" element={<WalletConnection onConnect={handleWalletConnect} />}/>
          <Route exact path="/insure-a-wallet" element={<InsureWallet wallet={wallet} />} />
          <Route exact path="/insure-loan-collateral" element={<InsureCollateral wallet={wallet} />} />
          <Route exact path="/admin-dashboard" element={<AdminDashboard wallet={wallet} />} />
        </Routes>
    </Router>
  );
};

export default VariousRoutes;
