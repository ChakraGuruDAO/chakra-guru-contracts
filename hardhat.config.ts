import { HardhatUserConfig } from "hardhat/config";
import "tsconfig-paths/register";

import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "hardhat-watcher";
import "solidity-coverage";
import "solidity-docgen";

import "@openzeppelin/hardhat-upgrades";

import "./tasks";

import { buildHardhatNetworkAccount, getPKs } from "./utils/configInit";
import { ENVIRONMENT } from "./utils/env";

const accounts = getPKs();
const hardhatNetworkAccounts = buildHardhatNetworkAccount(accounts);

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  paths: {
    sources: "./contracts",
    cache: "./build/cache",
    artifacts: "./build/artifacts",
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: { accounts: hardhatNetworkAccounts },
    ganache: {
      url: "http://127.0.0.1:7545/",
      chainId: 1337,
      accounts: {
        mnemonic: "dose fun table shed slab display unfair rural trip punch pudding fox",
      },
    },
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
  watcher: {
    compilation: {
      tasks: ["compile"],
    },
  },
};

export default config;
