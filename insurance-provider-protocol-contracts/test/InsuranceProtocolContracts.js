// Importing necessary dependencies as follows
const { expect } = require('chai');
const { ethers } = require('hardhat');

// Describing the contract factory to be tested as follows
describe('InsuranceProtocolFactory', function () {
  let insuranceProtocolFactory;
  let insuranceProtocol;
  let owner;
  let user;

  // Deploying the contract before each test as follows
  beforeEach(async function () {
    const InsuranceProtocolFactory = await ethers.getContractFactory('InsuranceProtocolFactory');
    insuranceProtocolFactory = await InsuranceProtocolFactory.deploy();
    await insuranceProtocolFactory.deployed();

    [owner, user] = await ethers.getSigners();
  });

  // Testing the createInsuranceContract() function as follows
  describe('createInsuranceContract', function () {
    it('should create a new insurance contract', async function () {
      await insuranceProtocolFactory.connect(user).createInsuranceContract();

      const contractAddress = await insuranceProtocolFactory.getContractByOwner(user.address);
      const deployedContracts = await insuranceProtocolFactory.getDeployedContracts();

      expect(contractAddress).to.not.equal(ethers.constants.AddressZero);
      expect(deployedContracts).to.have.lengthOf(1);
      expect(deployedContracts[0]).to.equal(contractAddress);

      // Get the deployed InsuranceProtocol contract
      insuranceProtocol = await ethers.getContractAt('InsuranceProtocol', contractAddress);
      expect(insuranceProtocol.address).to.equal(contractAddress);
    });

    it('should revert if a contract already exists for the address', async function () {
      await insuranceProtocolFactory.connect(user).createInsuranceContract();

      await expect(insuranceProtocolFactory.connect(user).createInsuranceContract()).to.be.revertedWith(
        'Contract already exists for this address'
      );
    });
  });

  // Describing the InsuranceProtocol contract as follows
describe('InsuranceProtocol', function () {
    let insuranceProtocol;
    let owner;
    let user;
  
    // Deploying the contract before each test as follows
    beforeEach(async function () {
      const InsuranceProtocolFactory = await ethers.getContractFactory('InsuranceProtocolFactory');
      const insuranceProtocolFactory = await InsuranceProtocolFactory.deploy();
      await insuranceProtocolFactory.deployed();
  
      [owner, user] = await ethers.getSigners();
  
      await insuranceProtocolFactory.connect(user).createInsuranceContract();
  
      const contractAddress = await insuranceProtocolFactory.getContractByOwner(user.address);
  
      // Get the deployed InsuranceProtocol contract
      insuranceProtocol = await ethers.getContractAt('InsuranceProtocol', contractAddress);
    });
  
    // Test cases for the InsuranceProtocol contract
    it('should have the contractOwner set correctly', async function () {
      expect(await insuranceProtocol.contractOwner()).to.equal(user.address);
    });
  
    it('should select the package and transfer premium amount', async function () {
        const InsurancePackage = {
          Regular: 0,
          Robust: 1,
          Comprehensive: 2,
        };
      
        const packageType = InsurancePackage.Regular;
      
        // Get the premium amount from the user struct
        const userPackageBefore = await insuranceProtocol.users(user.address);
        const premiumAmount = 10
        
        //const premiumAmountWei = ethers.utils.parseEther(premiumAmount.toString());
        const premiumAmountWei = BigInt(premiumAmount);
        await insuranceProtocol.connect(user).selectPackage(packageType, { value: premiumAmountWei });

      
        // await insuranceProtocol.connect(user).selectPackage(packageType, { value: premiumAmount });
      
        const userPackageAfter = await insuranceProtocol.users(user.address);
        const contractBalance = await ethers.provider.getBalance(insuranceProtocol.address);
        console.log(contractBalance);
      
        expect(userPackageAfter.package).to.equal(packageType);
        expect(userPackageAfter.isActive).to.equal(true);
        expect(contractBalance).to.equal(premiumAmountWei);
      });
      
  
    // Add more test cases for other functions in the InsuranceProtocol contract  
  });
});



  /*
// Describe the contract to be tested
describe('InsuranceProtocol', function () {
  let insuranceProtocol;
  let owner;
  let user;

  // Deploy the contract before each test
  beforeEach(async function () {
    const InsuranceProtocol = await ethers.getContractFactory('InsuranceProtocol');
    insuranceProtocol = await InsuranceProtocol.deploy();
    await insuranceProtocol.deployed();

    [owner, user] = await ethers.getSigners();
  });

  // Test the selectPackage() function
  describe('selectPackage', function () {
    it('should select the package and transfer premium amount', async function () {
      const InsurancePackage = {
        Regular: 0,
        Robust: 1,
        Comprehensive: 2,
      };

      const packageType = InsurancePackage.Regular;
      const premiumAmount = await insuranceProtocol.regularPremium();

      await insuranceProtocol.connect(user).selectPackage(packageType, { value: premiumAmount });

      const userPackage = await insuranceProtocol.users(user.address);
      const contractBalance = await ethers.provider.getBalance(insuranceProtocol.address);

      expect(userPackage.package).to.equal(packageType);
      expect(userPackage.isActive).to.equal(true);
      expect(contractBalance).to.equal(premiumAmount);
    });

    it('should revert if the user already has an active insurance package', async function () {
      const InsurancePackage = {
        Regular: 0,
        Robust: 1,
        Comprehensive: 2,
      };

      const packageType = InsurancePackage.Regular;
      const premiumAmount = await insuranceProtocol.regularPremium();

      await insuranceProtocol.connect(user).selectPackage(packageType, { value: premiumAmount });

      await expect(insuranceProtocol.connect(user).selectPackage(packageType, { value: premiumAmount })).to.be.revertedWith(
        'User already has an active insurance package.'
      );
    });

    it('should revert if an invalid insurance package is selected', async function () {
      const invalidPackageType = 3;
      const premiumAmount = await insuranceProtocol.regularPremium();

      await expect(insuranceProtocol.connect(user).selectPackage(invalidPackageType, { value: premiumAmount })).to.be.revertedWith(
        'Invalid insurance package selected.'
      );
    });

    it('should revert if the premium amount is insufficient', async function () {
      const InsurancePackage = {
        Regular: 0,
        Robust: 1,
        Comprehensive: 2,
      };

      const packageType = InsurancePackage.Regular;
      const premiumAmount = await insuranceProtocol.regularPremium();

      await expect(insuranceProtocol.connect(user).selectPackage(packageType, { value: premiumAmount.div(2) })).to.be.revertedWith(
        'Insufficient premium amount.'
      );
    });
  });

  // Add more test cases for other functions as needed
});
*/

