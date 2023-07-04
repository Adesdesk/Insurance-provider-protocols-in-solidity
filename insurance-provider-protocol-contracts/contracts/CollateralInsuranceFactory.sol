// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./CollateralInsurance.sol";

contract CollateralInsuranceFactory {
    address[] public deployedContracts;
    mapping(address => address) public collateralContractOwners;
    mapping(address => bool) public hasContract;

    function createCollateralInsurance() external {
        require(!hasContract[msg.sender], "Contract already exists for this address");

        CollateralInsurance newCollateralContract = new CollateralInsurance();
        deployedContracts.push(address(newCollateralContract));
        collateralContractOwners[msg.sender] = address(newCollateralContract);
        hasContract[msg.sender] = true;
    }

    function getCollateralContractByOwner(address walletAddress) external view returns (address) {
        return collateralContractOwners[walletAddress];
    }

    function getDeployedCollateralContract() external view returns (address[] memory) {
        return deployedContracts;
    }
}
