import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import InsuranceProtocolFactory from '../contracts/InsuranceProtocolFactory.json';
// import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar/NavigationBar.js';

const InsureWallet = ({ wallet }) => {
//   const navigate = useNavigate();
  const [contract, setContract] = useState(null);
  const [deployedContracts, setDeployedContracts] = useState([]);
  const [walletConnectionStatus, setWalletConnectionStatus] = useState('');
  const [deploymentStatus, setDeploymentStatus] = useState('');

  useEffect(() => {
    // Initialize the contract and provider
    const initialize = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
    
        //const network = await provider.getNetwork();
    
        // Create a new contract instance
        const contractAddress = '0x3f2ec6863CF90Cf6B39FCC08E1ef317Aa98A7ECc';
        //const instance = new ethers.Contract(contractAddress, InsuranceProtocolFactory.abi, signer);
        const instance = new ethers.Contract(contractAddress, InsuranceProtocolFactory.abi, signer);
    
        setContract(instance);
        await fetchDeployedContracts(instance);
        } catch (error) {
        console.error('Error initializing contract:', error);
        }
    };
    if (wallet) {
        initialize();
      }
    }, [wallet]);
  

  // Fetch deployed contracts
  const fetchDeployedContracts = async (instance) => {
    try {
      const deployedContractAddresses = await instance.getDeployedContracts();
      setDeployedContracts(deployedContractAddresses);
    } catch (error) {
      console.error('Error fetching deployed contracts:', error);
    }
  };

  // Create a new InsuranceProtocol contract
  const createInsuranceContract = async () => {
    try {
      if (contract) {
        await contract.createInsuranceContract();
        await fetchDeployedContracts(contract);
      }
    } catch (error) {
      console.error('Error creating InsuranceProtocol contract:', error);
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-violet-500 to-fuchsia-500">
        <div className="flex flex-col items-center">
        {deploymentStatus && (
                        <div className="mt-4 text-yellow-500 text-center">
                            <p>{deploymentStatus}</p>
                        </div>
                    )}
        
          <div className="flex flex-col items-center p-4 rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-4">Cyrptocurrency Wallet Insurance Contracts</h2>
            <button
              className="bg-gray-700 text-white font-medium px-4 py-2"
              onClick={createInsuranceContract}
            >
              Create Insurance Contract
            </button>
            <br></br>

            <h6 className="text-blue-900">List of deployed contracts.</h6>

            {deployedContracts.length > 0 ? (
              <ul className="mt-4">
                {deployedContracts.map((contractAddress, index) => (
                  <li key={index}>{contractAddress}</li>
                ))}
              </ul>
            ) : (
              <p className="text-blue-900">None available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsureWallet;
