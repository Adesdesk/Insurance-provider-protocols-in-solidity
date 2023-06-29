// Import the necessary dependencies
const { expect } = require("chai");
const { ethers } = require("hardhat");

// Describe the tests for InsuranceProtocolFactory contract
describe("InsuranceProtocolFactory", function () {
  let insuranceProtocolFactory;
  let admin;
  let user1;
  let user2;
  let insuranceProtocol;

  // Deploy the contract and set up accounts before each test
  beforeEach(async function () {
    [admin, user1, user2] = await ethers.getSigners();

    const InsuranceProtocolFactory = await ethers.getContractFactory("InsuranceProtocolFactory");
    insuranceProtocolFactory = await InsuranceProtocolFactory.deploy();
    await insuranceProtocolFactory.deployed();

    await insuranceProtocolFactory.connect(user1).createInsuranceContract();
    const insuranceContractAddress = await insuranceProtocolFactory.userToInsuranceContract(user1.address);

    const InsuranceProtocol = await ethers.getContractFactory("InsuranceProtocol");
    // attach the 'InsuranceProtocol' contract factory to the existing instance of 'InsuranceProtocol' contract deployed at the specified insuranceContractAddress
    insuranceProtocol = await InsuranceProtocol.attach(insuranceContractAddress);
  });

  // Test the createInsuranceContract function
  it("should create an insurance contract", async function () {
    const userInsuranceContract = await insuranceProtocolFactory.getUserInsuranceContract(user1.address);
    expect(userInsuranceContract).to.equal(insuranceProtocol.address);
  });

  // Test the getUserInsuranceContract function
  it("should get user's insurance contract", async function () {
    const userInsuranceContract = await insuranceProtocolFactory.getUserInsuranceContract(user1.address);
    expect(userInsuranceContract).to.equal(insuranceProtocol.address);
  });

  // Test the getInsuranceContracts function
  it("should get all insurance contracts", async function () {
    const insuranceContracts = await insuranceProtocolFactory.getInsuranceContracts();
    expect(insuranceContracts.length).to.equal(1);
    expect(insuranceContracts[0]).to.equal(insuranceProtocol.address);
  });
});

