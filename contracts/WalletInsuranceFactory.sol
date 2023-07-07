// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

/**
 * @title WalletInsuranceFactory Smart Contract
 * @author Adeola David Adelakun
 * @notice The contract WalletInsuranceFactory.sol is a factory contract that enables each user to create their own instance 
 * of the WalletInsurance contract and this keeps track of corresponding owners for each instance of the contract they deploy.
 */

import "./WalletInsurance.sol";

contract WalletInsuranceFactory {
    address payable public verifierCompany; // Address of the verifier company
    address[] public deployedContracts; // Stores the addresses of all deployed WalletInsurance contracts
    mapping(address => address) public contractOwners; // Maps user addresses to their corresponding WalletInsurance contract addresses
    mapping(address => bool) public hasContract; // Tracks whether a user has deployed a WalletInsurance contract

    constructor(address payable _verifierCompany) {
        verifierCompany = _verifierCompany;
    }

    // Function to create a new instance of the WalletInsurance contract for the caller
    function createInsuranceContract() external {
        require(
            !hasContract[msg.sender],
            "Contract already exists for this address"
        );

        WalletInsurance newContract = new WalletInsurance(verifierCompany);
        deployedContracts.push(address(newContract));
        contractOwners[msg.sender] = address(newContract);
        hasContract[msg.sender] = true;
    }

    // Function to get the WalletInsurance contract address associated with a specific owner
    function getContractByOwner(address walletAddress) external view returns (address) {
        return contractOwners[walletAddress];
    }

    // Function to get all deployed WalletInsurance contract addresses
    function getDeployedContracts() external view returns (address[] memory) {
        return deployedContracts;
    }
}
