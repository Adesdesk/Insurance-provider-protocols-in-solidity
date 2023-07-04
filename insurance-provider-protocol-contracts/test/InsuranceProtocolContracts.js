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
    let user0;
    let user1;
    let user2;
    let user3;

    // Deploying the contract before each test as follows
    beforeEach(async function () {
      const InsuranceProtocolFactory = await ethers.getContractFactory('InsuranceProtocolFactory');
      const insuranceProtocolFactory = await InsuranceProtocolFactory.deploy();
      await insuranceProtocolFactory.deployed();

      [owner, user0, user1, user2, user3] = await ethers.getSigners();

      await insuranceProtocolFactory.connect(user2).createInsuranceContract();

      const contractAddress = await insuranceProtocolFactory.getContractByOwner(user2.address);

      // Get the deployed InsuranceProtocol contract
      insuranceProtocol = await ethers.getContractAt('InsuranceProtocol', contractAddress);
    });

    // Test cases for the InsuranceProtocol contract
    it('should have the contractOwner set correctly', async function () {
      expect(await insuranceProtocol.contractOwner()).to.equal(user2.address);
    });

    it('should select the package and register premium amount', async function () {
      const InsurancePackage = {
        Regular: 0,
        Robust: 1,
        Comprehensive: 2,
      };

      const packageType = InsurancePackage.Regular;

      // Get the premium amount from the user2 struct
      const userPackageBefore = await insuranceProtocol.users(user2.address);
      const premiumAmount = ethers.BigNumber.from("1000")

      const premiumAmountWei = BigInt(premiumAmount);
      await insuranceProtocol.connect(user2).selectPackage(packageType, { value: premiumAmountWei });

      const userPackageAfter = await insuranceProtocol.users(user2.address);

      // verify that package was inactive before the transaction
      expect(userPackageBefore.isActive).to.not.equal(true);

      // verify that package has become active after the transaction
      expect(userPackageAfter.package).to.equal(packageType);
      expect(userPackageAfter.isActive).to.equal(true);
    });

    // implementing a test case for submitting a claim as follows
    describe('submitClaim', function () {
      it('should allow a user to submit a claim', async function () {
        await insuranceProtocol.connect(user0).selectPackage(0, { value: 1000 });

        // Submit a claim
        await insuranceProtocol.connect(user0).submitClaim();

        // Check the claim status
        const claimStatus = await insuranceProtocol.claims(user0.address);
        expect(claimStatus).to.equal(0); // ClaimStatus.Pending
      });

      it('should revert if the user does not have an active insurance package', async function () {
        // Submit a claim without an active insurance package
        await expect(insuranceProtocol.connect(user0).submitClaim()).to.be.revertedWith(
          'User does not have an active insurance package.'
        );
      });
    });

    // Test case for only owner to approve a claim
    describe('approveClaim', function () {
      it('should have the contract owner set correctly', async function () {
        const contractOwner = await insuranceProtocol.contractOwner();
        expect(contractOwner).to.equal(user2.address);
      });

      it('should allow only the contract owner to approve a claim', async function () {
        await insuranceProtocol.connect(user0).selectPackage(0, { value: 1000 });
        await insuranceProtocol.connect(user0).submitClaim();

        // Approve the claim
        await expect(insuranceProtocol.connect(user0).approveClaim(user0.address)).to.be.revertedWith('Only the contract owner can perform this action.'
        );
        await insuranceProtocol.connect(user2).approveClaim(user0.address);

        // Check the claim status
        const claimStatus = await insuranceProtocol.claims(user0.address);
        expect(claimStatus).to.equal(1); // ClaimStatus.Approved
      });

      it('should revert if a claim has already been submitted or processed', async function () {
        await insuranceProtocol.connect(user0).selectPackage(0, { value: 1000 });

        // Submit a claim
        await insuranceProtocol.connect(user0).submitClaim();
        // approve the issued claim
        await insuranceProtocol.connect(user2).approveClaim(user0.address);

        // Attempt to submit another claim while one has been submitted
        await expect(insuranceProtocol.connect(user0).submitClaim()).to.be.revertedWith(
          'Claim has already been submitted or processed.'
        );
      });

      it('should revert if the user does not have an active insurance package', async function () {
        // Approve a claim for a user without an active insurance package
        await expect(insuranceProtocol.connect(user2).approveClaim(user0.address)).to.be.revertedWith(
          'User does not have an active insurance package.'
        );
      });

    });

  });
});
