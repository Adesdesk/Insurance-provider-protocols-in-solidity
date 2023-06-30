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

  console.log("Deploying CollateralProtectionFactory with the account:", deployer.address);
  
  const CollateralProtectionFactory = await ethers.getContractFactory("CollateralProtectionFactory");
  
  // Set the address of the escrow to be used as the constructor argument
  const escrowAddress = '0xa1B94ef0f24d7F4fd02285EFcb9202E6C6EC655B';

  // Deploy the CollateralProtectionFactory contract
  const collateralProtectionFactory = await CollateralProtectionFactory.deploy(escrowAddress);
  await collateralProtectionFactory.deployed();

  console.log("CollateralProtectionFactory contract deployed to:", collateralProtectionFactory.address);
  console.log("Escrow address:", escrowAddress);



  // Deploy the InsuranceProtocolFactory contract
  console.log("Deploying InsuranceProtocolFactory with the account:", deployer.address);
  const InsuranceProtocolFactory = await ethers.getContractFactory("InsuranceProtocolFactory");
  const insuranceProtocolFactory = await InsuranceProtocolFactory.deploy();

  await insuranceProtocolFactory.deployed();

  console.log("InsuranceProtocolFactory contract deployed to:", insuranceProtocolFactory.address);

  console.log("Deployment completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
