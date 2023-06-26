# Token-Vesting-Schedule - Frontend
This is the frontend component of a decentralized application that provides a platform for organizations to create their custom token and corresponding vesting schedule.

## Description

The DApp consists of two smart contracts, one which enables an rganization's admin to spin off their custom ERC20 token contract, and the other which allows them to create custom token vesting plans for 3 categories of stakeholders namely; Community, Validators, and Investors. The same contract can be adopted by a variety of organizations as each has the liberty to create their token, which address is passed to the a token vesting contract that enables them create their vesting plans for the same token.

Adding these categories of stakeholders is implemented using a custom data type, an enum which index can be supplied during function calls to specify appropriate categories to which an address should belong. Organization admins can add stakeholders and their corresponding vesting details. Vested tokens are released to beneficiary addresses in defined installments for withdrawal as each fragment of the timelock period elapses.

Organizations' admins can whitelist stakeholder addresses to enable them withdraw their released tokens and susch whitelisted addresses can make withdrawals of released tokens, provided they have the address of the contract which is specific to the organization where they belong.

## Getting Started

### Installing

* Clone this repository to get an exact copy of this program on your computer.
* Open the repository folder in your preferred command line interface. Using the terminal in VSCode is a good option.
* Once in the project folder, navigate into the frontend application folder by running the command
```
cd vesting-interface
```

### Executing program

* Ensure that the terminal now points to the vesting-interface folder, then run the following command
```
npm install
```
* When completed, run the command below to spin up the frontend app on your local computer's server.
```
npm start
```
* The app will spring open in your default browser where you will have access to the user interface, connect an ethereum wallet and carry out various transactions.

## Help

Ensure to lookout for transaction status prompts as these are a major guide to the transaction frlow in using the app. The provide feedback that notify you when a transaction is in progress, successful or declined.

## Authors

Contributor(s) name(s) and contact info

Name: Adeola David Adelakun 

Email: adesdesk@outlook.com


## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE - see the LICENSE.md file for details

### Addresses to a sample organization's deployment of this DApp's contract
##### 0x6B029ABDfAdA49cd645c96038DFfC23080De5C85 (single tranche token release version)
##### 0x552cC4A1dF08E5a17f7720dE457053574A9088cF (double tranche token release version)
