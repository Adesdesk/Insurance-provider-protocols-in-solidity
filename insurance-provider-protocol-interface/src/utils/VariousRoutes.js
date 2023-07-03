import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import WalletConnection from '../AppPages/WalletConnection';
import InsureWallet from '../AppPages/InsureWallet';
import AdminDashboard from '../AppPages/AdminDashboard';

const VariousRoutes = () => {
  const [wallet, setWallet] = useState(null);
  const [contractAddress, setContractAddress] = useState('');

  const handleWalletConnect = () => {
    setWallet(window.ethereum);
  };

  const handleContractDeploy = (address) => {
    setContractAddress(address);
  };

  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/"
          element={<WalletConnection onConnect={handleWalletConnect} />}
        />
        <Route
          exact
          path="/insure-a-wallet"
          element={<InsureWallet wallet={wallet} onContractDeploy={handleContractDeploy} />}
        />
        <Route
          exact
          path="/admin-dashboard"
          element={<AdminDashboard wallet={wallet} contractAddress={contractAddress} />}
        />
      </Routes>
    </Router>
  );
};

export default VariousRoutes;
