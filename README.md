# Project Title

Insurance-provider-protocols-in-solidity

## Description

A set of blockchain-based insurance provider protocols consisting of crypto wallet insurance and collateral protection (for crypto backed loans) components.

* The cryptocurrency wallet insurance protocol.

This protocol implements an insurance service that offers users up to 3 varieties of insurance policies in a WalletInsurance.sol smart contract. Users can choose one of the 3 packages namely Regular, Robust, and Comprehensive, all provided in a custom data type (enum InsurancePackage). The packages require users to pay an insurance amount of 1000wei, 10000wei and 100000wei respectively, every 28 days. The contract also recognizes an admin (the insurance company) to whose address all insurance amounts are paid. This admin gets to approve that a user be able to claim up to 2 times the total amount they have ever paid as premium, in a case that they raise a claim as a result of compromise to their insured wallet. The admin judges this and may approve or decline user claims. 

The contract WalletInsuranceFactory.sol is a factory contract that enables each user to create their own instance of the WalletInsurance contract and this keeps track of corresponding owners for each instance of the contract they deploy.

* The crypto backed loan collateral insurance Protocol.

This protocol on the other hand implements an insurance service that offers users up to 2 varieties of insurance policies in a CollateralInsurance.sol smart contract. Users can choose one of the 2 packages namely CATEGORY_A_PREMIUM and CATEGORY_B_PREMIUM. The packages require users to pay an insurance amount of 100000wei and 10000wei respectively, every 28 days. The contract also recognizes an admin (the insurance company) to whose address all insurance amounts are paid. This admin gets to approve that a user who opted for CATEGORY_A_PREMIUM is able to claim up to 3 ether worth of loan collateral value, while a user who opted for CATEGORY_B_PREMIUM is able to claim up to 2 ether worth of loan collateral value. The prerequisite to claiming the funds is yet an approval by the insurance company who would verify that there was a drop in collateral value. The admin may approve or decline user claims.

The contract CollateralInsuranceFactory.sol is a factory contract that enables each user to create their own instance of the CollateralInsurance contract and this keeps track of corresponding owners for each instance of the contract they deploy.

## Getting Started
* Open your favorite terminal and change the current working directory to the location where you want this repository to be cloned.
* Run the command below to clone a copy of this repository to your computer
```
git clone https://github.com/Adesdesk/Insurance-provider-protocols-in-solidity.git
```

### Installing

* Change the current working directory to the folder where this cloned project is in your computer
* Run the following command to install required dependencies
```
npm install
```

### Executing program

* Once done, run the following commands in the same order, one on each split side of your terminal, so as to start a local blockchain node and see the code work in various test cases
```
npx hardhat node
npx hardhat test
```

## Help

* Ensure to have Node.js installed to your computer
* If you wish to run the test files individually, you can run the following commands
```
npx hardhat test test/CollateralInsurance.js
npx hardhat test test/CollateralInsuranceFactory.js
npx hardhat test test/WalletInsurance.js
npx hardhat test test/WalletInsuranceFactory.js
```

## Authors

Contributor(s) names and contact info

Name: Adeola David Addelakun 

Email: adesdesk@outlook.com


## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE - see the LICENSE.md file for details