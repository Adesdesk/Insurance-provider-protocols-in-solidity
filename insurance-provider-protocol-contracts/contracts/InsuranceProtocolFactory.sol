// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./InsuranceProtocol.sol";

contract InsuranceProtocolFactory {
    mapping(address => address) public userToInsuranceContract;
    address[] public insuranceContracts;
    
    event InsuranceContractCreated(address indexed insuranceContract, address indexed walletOwner);
    
    function createInsuranceContract() external {
        require(userToInsuranceContract[msg.sender] == address(0), "Insurance contract already exists for the user");
        
        InsuranceProtocol newInsuranceContract = new InsuranceProtocol();
        insuranceContracts.push(address(newInsuranceContract));
        userToInsuranceContract[msg.sender] = address(newInsuranceContract);
        
        emit InsuranceContractCreated(address(newInsuranceContract), msg.sender);
    }
    
    function getUserInsuranceContract(address _user) external view returns (address) {
        return userToInsuranceContract[_user];
    }
    
    function getInsuranceContracts() external view returns (address[] memory) {
        return insuranceContracts;
    }
}
