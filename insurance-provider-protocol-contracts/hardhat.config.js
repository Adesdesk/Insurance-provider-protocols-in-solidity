require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */

require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
const { API_URL, API_URLII, PRIVATE_KEY, POLYGONSCAN_KEY } = process.env;

module.exports = {
  solidity: "0.8.19",
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {},
    mumbai: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
    },
    goerli: {
      url: API_URLII,
      chainId: 5,
      currencySymbol: "GoerliETH",
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: POLYGONSCAN_KEY,
      goerli: POLYGONSCAN_KEY,
    },
  },
};