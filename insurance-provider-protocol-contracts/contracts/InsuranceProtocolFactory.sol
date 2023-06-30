// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./InsuranceProtocol.sol";

contract InsuranceProtocolFactory {
    address[] public deployedContracts;
    mapping(address => address) public contractOwners;

    function createInsuranceContract() external {
        address newContract = address(new InsuranceProtocol());
        deployedContracts.push(newContract);
        contractOwners[newContract] = msg.sender;
    }

    function getDeployedContracts() external view returns (address[] memory) {
        return deployedContracts;
    }
}
