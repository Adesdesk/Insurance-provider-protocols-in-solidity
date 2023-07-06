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
    address[] public deployedContracts;
    address payable public verifierCompany;
    mapping(address => address) public collateralContractOwners;
    mapping(address => bool) public hasContract;

    constructor(address payable _verifierCompany) {
        verifierCompany = _verifierCompany;
    }

    function createCollateralInsurance() external {
        require(
            !hasContract[msg.sender],
            "Contract already exists for this address"
        );

        CollateralInsurance newCollateralContract = new CollateralInsurance(verifierCompany);
        deployedContracts.push(address(newCollateralContract));
        collateralContractOwners[msg.sender] = address(newCollateralContract);
        hasContract[msg.sender] = true;
    }

    function getCollateralContractByOwner(
        address walletAddress
    ) external view returns (address) {
        return collateralContractOwners[walletAddress];
    }

    function getDeployedCollateralContract()
        external
        view
        returns (address[] memory)
    {
        return deployedContracts;
    }
}
