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
    address payable public verifierCompany;
    address[] public deployedContracts;
    mapping(address => address) public contractOwners;
    mapping(address => bool) public hasContract;

    constructor(address payable _verifierCompany) {
        verifierCompany = _verifierCompany;
    }

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

    function getContractByOwner(
        address walletAddress
    ) external view returns (address) {
        return contractOwners[walletAddress];
    }

    function getDeployedContracts() external view returns (address[] memory) {
        return deployedContracts;
    }
}