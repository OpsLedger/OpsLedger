/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    hardhat: {},
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/YOUR_INFURA_PROJECT_ID", // Replace with Infura project ID
      accounts: [`0x${YOUR_PRIVATE_KEY}`]  // Replace with your private key
    },
    goerli: {
      url: "https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID",  // Replace with Infura project ID
      accounts: [`0x${YOUR_PRIVATE_KEY}`]  // Replace with your private key
    }
  }
};

