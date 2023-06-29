const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InsuranceContractFactory", function () {
  let factory;
  let contractInstance;

  before(async function () {
    const InsuranceContractFactory = await ethers.getContractFactory("InsuranceContractFactory");
    factory = await InsuranceContractFactory.deploy();
    await factory.deployed();
  });

  it("Should deploy an instance of InsuranceContract", async function () {
    await factory.createInsuranceContract();

    const deployedContracts = await factory.getDeployedContracts();
    expect(deployedContracts.length).to.equal(1);

    const contractAddress = deployedContracts[0];
    const InsuranceContract = await ethers.getContractFactory("InsuranceContract");
    contractInstance = await InsuranceContract.attach(contractAddress);
  });

  it("Should select an insurance package", async function () {
    const selectedPackage = 1; // Numerical value associated with the 'Robust' enum value
  
    await contractInstance.selectPackage(selectedPackage);
    const user = await contractInstance.users(await contractInstance.contractOwner());
    
    expect(user.package).to.equal(selectedPackage);
    expect(user.isActive).to.equal(true);
  });

  it("Should submit and approve a claim", async function () {
    await contractInstance.submitClaim();
    const claimStatus = await contractInstance.claims(await contractInstance.contractOwner());
    expect(claimStatus).to.equal(contractInstance.ClaimStatus.Pending);

    await contractInstance.approveClaim(await contractInstance.contractOwner());
    const approvedClaimStatus = await contractInstance.claims(await contractInstance.contractOwner());
    expect(approvedClaimStatus).to.equal(contractInstance.ClaimStatus.Approved);
  });
});
