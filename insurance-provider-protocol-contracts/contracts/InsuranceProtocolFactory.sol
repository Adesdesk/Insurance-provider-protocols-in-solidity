// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./InsuranceProtocol.sol";

contract InsuranceProtocolFactory {
    address public verifierCompany;
    address[] public deployedContracts;
    mapping(address => address) public contractOwners;
    mapping(address => bool) public hasContract;

    constructor(address _verifierCompany) {
        verifierCompany = _verifierCompany;
    }

    function createInsuranceContract() external {
        require(
            !hasContract[msg.sender],
            "Contract already exists for this address"
        );

        InsuranceProtocol newContract = new InsuranceProtocol(verifierCompany);
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