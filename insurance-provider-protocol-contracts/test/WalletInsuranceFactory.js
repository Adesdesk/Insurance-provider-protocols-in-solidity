const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("WalletInsuranceFactory", function () {
  let walletInsuranceFactory;
  let verifierCompany;
  let owner;
  let signer2;
  let signer3;
  let contractAddress;

  before(async function () {
    [owner, signer2, signer3] = await ethers.getSigners();

    const WalletInsuranceFactory = await ethers.getContractFactory("WalletInsuranceFactory");
    walletInsuranceFactory = await WalletInsuranceFactory.deploy(owner.address);

    await walletInsuranceFactory.deployed();
    verifierCompany = owner.address;
  });

  it("should create a new insurance contract", async function () {
    await walletInsuranceFactory.createInsuranceContract();

    contractAddress = await walletInsuranceFactory.getContractByOwner(owner.address);
    const contract = await ethers.getContractAt("WalletInsurance", contractAddress);

    expect(contract).to.exist;
    expect(await contract.verifierCompany()).to.equal(verifierCompany);
  });

  it("should return the correct contract address for an owner", async function () {
    const retrievedContractAddress = await walletInsuranceFactory.getContractByOwner(
      owner.address
    );

    expect(retrievedContractAddress).to.equal(contractAddress);
  });

  it("should return the list of deployed contracts", async function () {
    const deployedContracts = await walletInsuranceFactory.getDeployedContracts();

    expect(deployedContracts).to.deep.equal([contractAddress]);
  });

  it("should add a new user's contract to the list of deployed contracts", async function () {
  
    await walletInsuranceFactory.connect(signer3).createInsuranceContract();
  
    const deployedContracts = await walletInsuranceFactory.getDeployedContracts();
  
    expect(deployedContracts).to.have.lengthOf(2);
    expect(deployedContracts).to.include(contractAddress);
  
    const newContractAddress = await walletInsuranceFactory.getContractByOwner(signer3.address);
    expect(deployedContracts).to.include(newContractAddress);
  });
  
});
