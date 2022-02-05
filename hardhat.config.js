require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

let secret = require("./secret");

// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    mumbai: {
      url: secret.url,
      accounts: [secret.key],
    }
  },
  etherscan: {
    apiKey: secret.etherscanAPIKey,
  }
};
