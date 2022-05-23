import { ENVIRONMENT } from "./config/env";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-web3";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "solidity-docgen";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: ENVIRONMENT.NETWORKS.ROPSTEN.URL,
      accounts: { mnemonic: ENVIRONMENT.MNEMONIC },
    },
    rinkeby: {
      url: ENVIRONMENT.NETWORKS.RINKEBY.URL,
      accounts: { mnemonic: ENVIRONMENT.MNEMONIC },
    },
    fuji: {
      url: ENVIRONMENT.NETWORKS.AVALANCHE_FUJI.URL,
      accounts: { mnemonic: ENVIRONMENT.MNEMONIC },
    },
    bsc: {
      url: ENVIRONMENT.NETWORKS.BSC.URL,
      accounts: { mnemonic: ENVIRONMENT.MNEMONIC },
    },
  },
  docgen: {},
  gasReporter: {
    enabled: ENVIRONMENT.REPORT.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: ENVIRONMENT.ETHERSCAN.API_KEY,
  },
};

export default config;
