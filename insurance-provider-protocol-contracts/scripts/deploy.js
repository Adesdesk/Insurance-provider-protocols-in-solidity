// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy CollateralProtectionFactory contract
  const CollateralProtectionFactory = await ethers.getContractFactory("CollateralProtectionFactory");
  const collateralProtectionFactory = await CollateralProtectionFactory.deploy();
  await collateralProtectionFactory.deployed();

  console.log("CollateralProtectionFactory contract deployed at:", collateralProtectionFactory.address);

  // Deploy CollateralProtection contract using CollateralProtectionFactory
  const deployTransaction = await collateralProtectionFactory.deployCollateralProtection();
  await deployTransaction.wait();

  const userContractAddress = await collateralProtectionFactory.getCollateralProtectionContract(deployer.address);
  console.log("CollateralProtection contract deployed for user", deployer.address, "at:", userContractAddress);

  // Deploy InsuranceProtocolFactory contract
  const InsuranceProtocolFactory = await ethers.getContractFactory("InsuranceProtocolFactory");
  const insuranceProtocolFactory = await InsuranceProtocolFactory.deploy();
  await insuranceProtocolFactory.deployed();

  console.log("InsuranceProtocolFactory contract deployed at:", insuranceProtocolFactory.address);

  // Deploy InsuranceProtocol contract using InsuranceProtocolFactory
  const createInsuranceTransaction = await insuranceProtocolFactory.createInsuranceContract();
  await createInsuranceTransaction.wait();

  const userInsuranceContractAddress = await insuranceProtocolFactory.getUserInsuranceContract(deployer.address);
  console.log("InsuranceProtocol contract deployed for user", deployer.address, "at:", userInsuranceContractAddress);
}

// Execute the deployment
main()
  .then(() => console.log("Deployment completed successfully."))
  .catch((error) => console.error("Deployment error:", error));

