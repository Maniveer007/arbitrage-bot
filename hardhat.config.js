require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
/** @type import('hardhat/config').HardhatUserConfig */

const SEPOLIA_URL="https://sepolia.infura.io/v3/f974c32fc2af440692f1ff90f293b41e";

module.exports = {
  solidity: "0.8.20",
  networks: {
  //   sepolia: {
  //     url: SEPOLIA_URL,
  //     accounts: [`0x${process.env.PRIVATE_KEY}`],
  // },
  hardhat: {
    forking: {
      url: "https://mainnet.infura.io/v3/f974c32fc2af440692f1ff90f293b41e",
      blockNumber: 20227457
    }
  }
  },
};
