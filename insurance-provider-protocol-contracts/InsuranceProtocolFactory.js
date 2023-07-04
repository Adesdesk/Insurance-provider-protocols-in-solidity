const { Web3 } = require('web3');

const providerUrl = 'http://127.0.0.1:8545/';
const provider = new Web3.providers.HttpProvider(providerUrl);
const web3 = new Web3(provider);

const factoryContractObject = require('./artifacts/contracts/InsuranceProtocolFactory.sol/InsuranceProtocolFactory.json');
const factoryContractABI = factoryContractObject.abi;
const factoryContractAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';
const factoryContract = new web3.eth.Contract(factoryContractABI, factoryContractAddress);


// Create a new insurance contract and return the deployed contract address:
async function createInsuranceContract() {
    try {
        const accounts = await web3.eth.getAccounts();
        await factoryContract.methods.createInsuranceContract().send({ from: accounts[0] });
        console.log('Insurance contract created successfully!');
    } catch (error) {
        console.error('Failed to create insurance contract:', error);
    }
}

// Get the contract address associated with the deployer's wallet address
async function getContractByOwner(walletAddress) {
    try {
      const result = await factoryContract.methods.getContractByOwner(walletAddress).call();
      console.log("Contract Address:", result);
    } catch (error) {
      console.error(error);
  }
}
  

// Get the array of deployed contract addresses:
async function getDeployedContracts() {
    try {
        const deployedContracts = await factoryContract.methods.getDeployedContracts().call();
        console.log('Deployed contracts:', deployedContracts);
    } catch (error) {
        console.error('Failed to get deployed contracts:', error);
    }
}

// invoke the functions
(async () => {
    await createInsuranceContract();

    const accounts = await web3.eth.getAccounts();
    const deployerAddress = accounts[0];
    getContractByOwner(deployerAddress);

    getDeployedContracts();
    console.log(accounts[0]);
})();
