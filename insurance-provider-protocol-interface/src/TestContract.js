import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import TestContractObject from './contracts/TestToken.json';

const TestContract = ({ wallet }) => {
  const [tokenContract, setTokenContract] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    // Initialize the contract
    const initContract = async () => {
      try {
        // Create a new provider connected to the Ethereum network
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Create an instance of the contract
        const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';
        const contract = new ethers.Contract(contractAddress, TestContractObject, signer);

        setTokenContract(contract);
      } catch (error) {
        console.error(error);
      }
    };

    initContract();
  }, [wallet.ethereum]);

  const handleMint = async () => {
    try {
      // Call the 'mint' function of the contract
      await tokenContract.mint(recipient, amount);
      console.log('Minting successful!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleTransfer = async () => {
    try {
      // Call the 'transfer' function of the contract
      await tokenContract.transfer(recipient, amount);
      console.log('Transfer successful!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-900">
      <div className="max-w-lg px-4 py-2 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl text-center font-bold mb-2">Interact with token</h2>
        <div className="flex flex-col space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="recipient">
              Recipient Address
            </label>
            <input
              className="border border-gray-300 rounded-md px-4 py-2 w-full"
              id="recipient"
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="amount">
              Amount
            </label>
            <input
              className="border border-gray-300 rounded-md px-4 py-2 w-full"
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleMint}
            >
              Mint
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleTransfer}
            >
              Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestContract;
