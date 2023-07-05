const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("CollateralInsuranceFactory", () => {
    let CollateralInsuranceFactory;
    let CollateralInsurance;
    let collateralInsuranceFactory;
    let verifierCompany;
    let owner;
    let addr1;
    let addr2;
  
    before(async () => {
      // Get signers from the hardhat local blockchain node
      [owner, addr1, addr2] = await ethers.getSigners();
  
      // Compile the contracts and get the ContractFactories
      CollateralInsuranceFactory = await ethers.getContractFactory("CollateralInsuranceFactory");
      CollateralInsurance = await ethers.getContractFactory("CollateralInsurance");
  
      // Deploy the CollateralInsuranceFactory contract with the verifier company address
      verifierCompany = owner.address;
      collateralInsuranceFactory = await CollateralInsuranceFactory.deploy(verifierCompany);
      await collateralInsuranceFactory.deployed();
    });
  
    it("should create a new collateral insurance contract", async () => {
      await collateralInsuranceFactory.createCollateralInsurance();
  
      const contractAddress = await collateralInsuranceFactory.getCollateralContractByOwner(owner.address);
      expect(contractAddress).to.not.be.null;
    });
  
    it("should return the correct collateral insurance contract for an owner", async () => {
      const contractAddress1 = await collateralInsuranceFactory.getCollateralContractByOwner(owner.address);
      const contractAddress2 = await collateralInsuranceFactory.getCollateralContractByOwner(addr1.address);
  
      expect(contractAddress1).to.not.equal(contractAddress2);
    });
  
    it("should return the list of deployed collateral insurance contracts", async () => {
        // deploy a new instance for another user so as to add to the list
      await collateralInsuranceFactory.connect(addr2).createCollateralInsurance();
  
      const deployedContracts = await collateralInsuranceFactory.getDeployedCollateralContract();
  
      expect(deployedContracts).to.have.lengthOf(2);
    });
  
    it("should not allow creating multiple contracts for the same address", async () => {
      await expect(collateralInsuranceFactory.createCollateralInsurance()).to.be.revertedWith(
        "Contract already exists for this address"
      );
    });
  });