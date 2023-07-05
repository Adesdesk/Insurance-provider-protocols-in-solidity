// // Importing necessary dependencies as follows
// const { expect } = require('chai');
// const { ethers } = require('hardhat');

// // Describing the CollateralInsuranceFactory contract to be tested as follows
// describe('CollateralInsuranceFactory', function () {
//     let collateralInsuranceFactory;
//     let collateralInsurance;
//     let owner;
//     let user;

//     // Deploying the contract before each test as follows
//     beforeEach(async function () {
//         const CollateralInsuranceFactory = await ethers.getContractFactory('CollateralInsuranceFactory');
//         collateralInsuranceFactory = await CollateralInsuranceFactory.deploy();
//         await collateralInsuranceFactory.deployed();

//         [owner, user] = await ethers.getSigners();
//     });

//     // Testing the createInsuranceContract() function as follows
//     describe('createInsuranceContract', function () {
//         it('should create a new insurance contract', async function () {
//             await collateralInsuranceFactory.connect(user).createInsuranceContract();

//             const contractAddress = await collateralInsuranceFactory.getContractByOwner(user.address);
//             const deployedContracts = await collateralInsuranceFactory.getDeployedContracts();

//             expect(contractAddress).to.not.equal(ethers.constants.AddressZero);
//             expect(deployedContracts).to.have.lengthOf(1);
//             expect(deployedContracts[0]).to.equal(contractAddress);

//             // Get the deployed CollateralInsurance contract
//             collateralInsurance = await ethers.getContractAt('CollateralInsurance', contractAddress);
//             expect(collateralInsurance.address).to.equal(contractAddress);
//         });

//         it('should revert if a contract already exists for the address', async function () {
//             await collateralInsuranceFactory.connect(user).createInsuranceContract();

//             await expect(collateralInsuranceFactory.connect(user).createInsuranceContract()).to.be.revertedWith(
//                 'Contract already exists for this address'
//             );
//         });
//     });
// });