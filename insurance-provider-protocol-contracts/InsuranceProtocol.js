const { ethers } = require("hardhat");

// Import the compiled smart contract artifacts
const contractArtifact = require("./artifacts/contracts/InsuranceProtocol.sol/InsuranceProtocol.json");

async function main() {
  // Get the local Hardhat network provider
  const provider = ethers.provider;

  // Get the signer (default account) from the provider
  const [signer0, signer1, signer2, signer3, signer4] = await ethers.getSigners();

  // Deployed contract address on the local Hardhat network
  const contractAddress = "0x6D544390Eb535d61e196c87d6B9c80dCD8628Acd";

  // Create a contract instance using the contract artifact and deployed address
  const contract = new ethers.Contract(contractAddress, contractArtifact.abi, signer0);

  // Get the contract owner's address
  const contractOwnerAddress = await contract.contractOwner();

  // Get the signer for the contract owner's address
  const owner = provider.getSigner(contractOwnerAddress);

  // Call contract functions

  // Example: Select an insurance package
  const selectPackageTx = await contract.selectPackage(0, { value: ethers.utils.parseEther("10") });
  await selectPackageTx.wait();

  // Example: Get contract balance
  const contractBalance = await contract.connect(owner).getContractBalance();
  console.log("Contract Balance:", ethers.utils.formatEther(contractBalance));
  
  /*/ Example: Submit a claim
  const submitClaimTx = await contract.submitClaim();
  await submitClaimTx.wait();*/

  /*/ Example: Approve a claim (requires contract owner's address)
  const approveClaimTx = await contract.approveClaim("<user_address>");
  await approveClaimTx.wait();

  // Example: Reject a claim (requires contract owner's address)
  const rejectClaimTx = await contract.rejectClaim("<user_address>");
  await rejectClaimTx.wait();

  // Example: Cancel insurance
  const cancelInsuranceTx = await contract.cancelInsurance();
  await cancelInsuranceTx.wait();*/

  /*/ Example: Withdraw funds (only contract owner)
  const withdrawFundsTx = await contract.withdrawFunds();
  await withdrawFundsTx.wait();*/

  // Example: Check premium payment
  const checkPremiumPaymentTx = await contract.checkPremiumPayment({ value: ethers.utils.parseEther("10") });
  await checkPremiumPaymentTx.wait();
}

// Run the main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
