// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

/**
 * @title CollateralInsuranceFactory Smart Contract
 * @author Adeola David Adelakun
 * @notice The contract CollateralInsuranceFactory.sol is a factory contract that enables each user to create their own instance 
 * of the CollateralInsurance contract and this keeps track of corresponding owners for each instance of the contract they deploy.
 */

import "./CollateralInsurance.sol";

contract CollateralInsuranceFactory {
    address[] public deployedContracts; // Stores the addresses of all deployed CollateralInsurance contracts
    address payable public verifierCompany; // Address of the verifier company
    mapping(address => address) public collateralContractOwners; // Maps user addresses to their corresponding CollateralInsurance contract addresses
    mapping(address => bool) public hasContract; // Tracks whether a user has deployed a CollateralInsurance contract

    constructor(address payable _verifierCompany) {
        verifierCompany = _verifierCompany;
    }

    // Function to create a new instance of the CollateralInsurance contract for the caller
    function createCollateralInsurance() external {
        require(
            !hasContract[msg.sender],
            "Contract already exists for this address"
        );

        // Deploy a new instance of the CollateralInsurance contract
        CollateralInsurance newCollateralContract = new CollateralInsurance(verifierCompany);
        
        // Store the address of the deployed contract
        deployedContracts.push(address(newCollateralContract));

        // Map the caller's address to the contract address
        collateralContractOwners[msg.sender] = address(newCollateralContract);

        // Update contract deployment status for the caller
        hasContract[msg.sender] = true;
    }

    // Function to get the CollateralInsurance contract address associated with a specific owner
    function getCollateralContractByOwner(address walletAddress) external view returns (address) {
        return collateralContractOwners[walletAddress];
    }

    // Function to get all deployed CollateralInsurance contract addresses
    function getDeployedCollateralContract() external view returns (address[] memory) {
        return deployedContracts;
    }
}
