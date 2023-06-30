const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('InsuranceContract', function () {
  let insuranceContract;
  let contractOwner;
  let user;

  beforeEach(async function () {
    const InsuranceContract = await ethers.getContractFactory('InsuranceContract');
    [contractOwner, user] = await ethers.getSigners();

    insuranceContract = await InsuranceContract.deploy();
    await insuranceContract.deployed();
  });

  it('should allow the user to select a valid insurance package', async function () {
    const InsurancePackage = {
      Regular: 0,
      Robust: 1,
      Comprehensive: 2,
    };

    const packageSelected = InsurancePackage.Regular;
    const premiumAmount = 100;

    await insuranceContract.connect(user).selectPackage(packageSelected, {
      value: premiumAmount,
    });

    const userPackage = await insuranceContract.users(user.address).package;
    expect(userPackage).to.equal(packageSelected);
  });

  it('should reject selection of an invalid insurance package', async function () {
    const invalidPackage = 3;
    const premiumAmount = 100;

    await expect(
      insuranceContract.connect(user).selectPackage(invalidPackage, {
        value: premiumAmount,
      })
    ).to.be.revertedWith('Invalid insurance package selected.');
  });

  it('should not allow the user to select a package if already active', async function () {
    const InsurancePackage = {
      Regular: 0,
      Robust: 1,
      Comprehensive: 2,
    };

    const packageSelected = InsurancePackage.Regular;
    const premiumAmount = 100;

    await insuranceContract.connect(user).selectPackage(packageSelected, {
      value: premiumAmount,
    });

    await expect(
      insuranceContract.connect(user).selectPackage(packageSelected, {
        value: premiumAmount,
      })
    ).to.be.revertedWith('User already has an active insurance package.');
  });

  // Add more tests for other contract functions
});
