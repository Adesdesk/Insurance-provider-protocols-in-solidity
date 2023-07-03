import React, { useState } from 'react';
import ContractContext from './ContractContext';

const ContractProvider = ({ children }) => {
  const [contractAddress, setContractAddress] = useState('');

  const updateContractAddress = (address) => {
    setContractAddress(address);
  };

  return (
    <ContractContext.Provider value={{ contractAddress, updateContractAddress }}>
      {children}
    </ContractContext.Provider>
  );
};

export default ContractProvider;
