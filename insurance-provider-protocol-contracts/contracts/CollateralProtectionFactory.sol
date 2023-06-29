// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./CollateralProtection.sol";

contract CollateralProtectionFactory {
    mapping(address => address) public collateralProtectionContracts;
    
    event ContractDeployed(address indexed contractAddress, address indexed user);

    address public escrow;

    constructor(address _escrow) {
        escrow = _escrow;
    }
    
    function deployCollateralProtection() external {
        require(collateralProtectionContracts[msg.sender] == address(0), "CollateralProtection contract already deployed for this user");
        
        CollateralProtection newContract = new CollateralProtection(escrow);
        collateralProtectionContracts[msg.sender] = address(newContract);
        
        emit ContractDeployed(address(newContract), msg.sender);
    }
    
    function getCollateralProtectionContract(address user) external view returns (address) {
        return collateralProtectionContracts[user];
    }
}

