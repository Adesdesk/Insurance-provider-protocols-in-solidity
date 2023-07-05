const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("InsuranceProtocolFactory", function () {
  let insuranceProtocolFactory;
  let verifierCompany;
  let owner;
  let signer2;
  let signer3;
  let contractAddress;

  before(async function () {
    [owner, signer2, signer3] = await ethers.getSigners();

    const InsuranceProtocolFactory = await ethers.getContractFactory("InsuranceProtocolFactory");
    insuranceProtocolFactory = await InsuranceProtocolFactory.deploy(owner.address);

    await insuranceProtocolFactory.deployed();
    verifierCompany = owner.address;
  });

  it("should create a new insurance contract", async function () {
    await insuranceProtocolFactory.createInsuranceContract();

    contractAddress = await insuranceProtocolFactory.getContractByOwner(owner.address);
    const contract = await ethers.getContractAt("InsuranceProtocol", contractAddress);

    expect(contract).to.exist;
    expect(await contract.verifierCompany()).to.equal(verifierCompany);
  });

  it("should return the correct contract address for an owner", async function () {
    const retrievedContractAddress = await insuranceProtocolFactory.getContractByOwner(
      owner.address
    );

    expect(retrievedContractAddress).to.equal(contractAddress);
  });

  it("should return the list of deployed contracts", async function () {
    const deployedContracts = await insuranceProtocolFactory.getDeployedContracts();

    expect(deployedContracts).to.deep.equal([contractAddress]);
  });

  it("should add a new user's contract to the list of deployed contracts", async function () {
  
    await insuranceProtocolFactory.connect(signer3).createInsuranceContract();
  
    const deployedContracts = await insuranceProtocolFactory.getDeployedContracts();
  
    expect(deployedContracts).to.have.lengthOf(2);
    expect(deployedContracts).to.include(contractAddress);
  
    const newContractAddress = await insuranceProtocolFactory.getContractByOwner(signer3.address);
    expect(deployedContracts).to.include(newContractAddress);
  });
  
});
