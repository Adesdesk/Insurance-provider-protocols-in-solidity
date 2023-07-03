import React, { useState } from 'react';
import { ethers } from 'ethers';
import InsuranceProtocolFactory from '../contracts/InsuranceProtocolFactory.json';
import NavigationBar from '../components/NavigationBar/NavigationBar';

const InsureWallet = ({ wallet, onContractDeploy }) => { 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [contractAddress, setContractAddress] = useState('');

  const FactoryContractAddress = '0x1bcB765f0c508d69e5bFDAae6602843Fd55FB306';

  const handleCreateInsuranceContract = async () => {
    setError('');
    setLoading(true);

    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const factoryContract = new ethers.Contract(
          FactoryContractAddress,
          InsuranceProtocolFactory.abi,
          signer
        );

        const existingContractAddress = await factoryContract.getContractByOwner(wallet.address);

        if (existingContractAddress !== ethers.constants.AddressZero) {
          setContractAddress(existingContractAddress);
        } else {
          await factoryContract.createInsuranceContract();
          onContractDeploy(existingContractAddress); 
          setSuccess(true);
        }
      } else {
        setError('Please connect a wallet');
      }
    } catch (error) {
      setError('Failed to create insurance contract');
    }

    setLoading(false);
  };

  return (
    <div>
      <NavigationBar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-violet-500 to-fuchsia-500">
        <h1 className="text-4xl font-bold mb-6 text-white">Insure a Cryptocurrency Wallet</h1>

        {loading && <p>Transaction processing...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && (
          <>
            <p className="text-gray-700 mb-4">An insurance contract has been successfully created for you!</p>
            <p className="text-gray-700 mb-4">Your contract address: {contractAddress}</p>
          </>
        )}

        {contractAddress === '' && (
          <button
            onClick={handleCreateInsuranceContract}
            className="bg-white text-gray-800 font-bold py-2 px-4 rounded-full shadow-lg"
            disabled={loading}
          >
            Instantiate Your Custom Insurance Contract
          </button>
        )}
      </div>
    </div>
  );
};
export default InsureWallet;
