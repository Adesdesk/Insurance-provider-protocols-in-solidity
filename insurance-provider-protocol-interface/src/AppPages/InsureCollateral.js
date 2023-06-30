import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CollateralProtectionFactory from '../contracts/CollateralProtectionFactory.json';
import NavigationBar from '../components/NavigationBar/NavigationBar.js';

const InsureCollateral = ({ wallet }) => {
  const [contract, setContract] = useState(null);
  const [deployedContracts, setDeployedContracts] = useState([]);
  const [deploymentStatus, setDeploymentStatus] = useState('');

  useEffect(() => {
    // Initialize the contract and provider
    const initialize = async () => {
      try {
        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
          throw new Error('MetaMask is not installed');
        }

        // Request access to the user's MetaMask account
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Create a new contract instance
        const networkId = await provider.getNetwork().then((network) => network.chainId);
        const deployedNetwork = CollateralProtectionFactory.networks[networkId];

        if (!deployedNetwork) {
          throw new Error('Contract not deployed on the current network');
        }

        const instance = new ethers.Contract(
          deployedNetwork.address,
          CollateralProtectionFactory.abi,
          signer
        );

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

  // Deploy a new CollateralProtection contract
  const deployCollateralProtection = async () => {
    try {
      if (!contract) {
        throw new Error('Contract not initialized');
      }

      const tx = await contract.deployCollateralProtection();

      // Wait for the transaction to be mined
      await tx.wait();

      // Update the list of deployed contracts
      await fetchDeployedContracts(contract);

      setDeploymentStatus('CollateralProtection contract deployed successfully');
    } catch (error) {
      console.error('Error deploying CollateralProtection contract:', error);
      setDeploymentStatus('Error deploying CollateralProtection contract');
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

          <button
            onClick={deployCollateralProtection}
            className="px-4 py-2 mt-4 text-white bg-green-500 rounded-md"
          >
            Create Your Collateral Protection Contract
          </button>

          <div className="mt-4">
            <h2 className="text-2xl">Deployed Contracts:</h2>
            <ul>
              {deployedContracts.map((address, index) => (
                <li key={index}>{address}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsureCollateral;
