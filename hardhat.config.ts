import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";

import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "solidity-docgen";

import "./tasks";

import { buildHardhatNetworkAccount, getPKs } from "./utils/configInit";
import { ENVIRONMENT } from "./utils/env";

const accounts = getPKs();
const hardhatNetworkAccounts = buildHardhatNetworkAccount(accounts);

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  paths: {
    sources: "./contracts/original",
  },
  networks: {
    hardhat: { accounts: hardhatNetworkAccounts },
    bsc: {
      url: ENVIRONMENT.NETWORKS.BSC.URL || "https://bsc-dataseed2.defibit.io/",
      chainId: 56,
      accounts,
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
