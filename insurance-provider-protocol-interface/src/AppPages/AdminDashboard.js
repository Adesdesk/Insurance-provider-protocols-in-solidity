import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import InsuranceProtocol from '../contracts/InsuranceProtocol';
import NavigationBar from '../components/NavigationBar/NavigationBar';

const AdminDashboard = ({ wallet, contractAddress }) => {
  const [insuranceContract, setInsuranceContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    initializeContract();
  }, []);

  const initializeContract = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, InsuranceProtocol.abi, signer);
      setInsuranceContract(contract);
    } catch (error) {
      console.error('Failed to initialize contract:', error);
    }
  };

  const getPolicyDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const policyDetails = await insuranceContract.getPolicyDetails();
      // Handle policy details
      console.log('Policy Details:', policyDetails);
    } catch (error) {
      setError('Failed to get policy details');
    }

    setLoading(false);
  };

  const submitClaim = async () => {
    setLoading(true);
    setError('');

    try {
      // Implement the logic to submit a claim
      // using the insuranceContract instance
    } catch (error) {
      setError('Failed to submit claim');
    }

    setLoading(false);
  };

  return (
    <div>
      <NavigationBar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-violet-500 to-fuchsia-500">
        <h1 className="text-4xl font-bold mb-6 text-white">Admin Dashboard</h1>

        <button onClick={getPolicyDetails} disabled={!insuranceContract || loading}>
          Get Policy Details
        </button>

        <button onClick={submitClaim} disabled={!insuranceContract || loading}>
          Submit Claim
        </button>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
      </div>
    </div>
  );
};

export default AdminDashboard;
