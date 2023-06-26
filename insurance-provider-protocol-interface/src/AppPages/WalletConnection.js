import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar/NavigationBar.js';

const WalletConnection = ({ onConnect }) => {
    const [walletConnected, setWalletConnected] = useState(false);
    const navigate = useNavigate();

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                setWalletConnected(true);
                onConnect();
            } catch (error) {
                console.log('Error connecting wallet:', error);
            }
        } else {
            console.log('No Ethereum wallet found');
        }
    };

    const handleNavigateToContractDeployment = () => {
        navigate('/register-organization-token');
    };

    const handleNavigateToTokenVesting = () => {
        navigate('/add-stakeholder-and-vesting');
    };

    const handleNavigateToWithdrawals = () => {
        navigate('/make-withdrawal');
    };

    const handleNavigateToWhitelisting = () => {
        navigate('/whitelist-addresses');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-violet-500 to-fuchsia-500">
            {walletConnected && (<NavigationBar />)}
            <h2 className="text-2xl text-center text-white font-bold mb-2">
            A blockchain-based insurance protocol provider DApp By Adeola David A.
            </h2>
            <div className="mt-5">
                {!walletConnected && (
                    <button
                        className="bg-gradient-to-r from-violet-900 to-fuchsia-900 text-2xl hover:bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-2 px-4 rounded"
                        onClick={connectWallet}
                    >
                        Connect Ethereum Wallet
                    </button>
                )}
                {walletConnected && (
                    <div className='flex flex-col items-center justify-center'>
                        <h6 className="text-sm text-center text-white font-bold mb-2">
                            <span className="text-red-500 bg-white">Attention!</span> The first 3 buttons initiate "admin only" transactions.
                            <br></br>
                            All other categories of users can initiate withdrawal of available tokens using the 4th (yellow) button, provided they are whitelisted.
                        </h6>
                        <button
                            className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-2"
                            onClick={handleNavigateToContractDeployment}
                        >
                            Connected! Click here to register an organization afresh
                        </button>

                        <button
                            className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-2"
                            onClick={handleNavigateToTokenVesting}
                        >
                            Already Registered? Get your contract address and click here to continue
                        </button>

                        <button
                            className="bg-blue-700 hover:bg-blue-600 mb-20 text-white font-bold py-2 px-4 rounded mt-2"
                            onClick={handleNavigateToWhitelisting}
                        >
                            Whitelist addresses
                        </button>

                        <button
                            className="bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mt-20"
                            onClick={handleNavigateToWithdrawals}
                        >
                            Not an admin and got tokens to claim? Click here to make withdrawals
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WalletConnection;
