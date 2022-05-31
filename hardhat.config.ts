import { HardhatUserConfig } from "hardhat/config";
import "tsconfig-paths/register";

import "@typechain/hardhat";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-solhint";

import "hardhat-gas-reporter";
import "hardhat-watcher";
import "solidity-coverage";
import "solidity-docgen";

import "@openzeppelin/hardhat-upgrades";

import "./tasks";

import { buildHardhatNetworkAccount, getPKs } from "./utils/configInit";
import { ENVIRONMENT } from "./utils/env.config";

const accounts = getPKs();

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: { accounts: buildHardhatNetworkAccount(accounts) },
    ganache: {
      url: "http://127.0.0.1:7545/",
      chainId: 1337,
      accounts,
    },
    bsc: {
      url: "https://bsc-dataseed3.binance.org",
      chainId: 56,
      accounts,
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts,
    },
  },
  docgen: {},
  gasReporter: {
    enabled: ENVIRONMENT.REPORT_GAS,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      bsc: ENVIRONMENT.ETHERSCAN.BSC,
      bscTestnet: ENVIRONMENT.ETHERSCAN.BSC,
    },
  },
  typechain: {
    outDir: "endpoints",
  },
  watcher: {
    compilation: {
      tasks: ["compile"],
    },
  },
};

export default config;
