import { getConfigKey } from "./getConfigKey";
import { boolParser } from "./parsers";

const configKey = getConfigKey<Environment>();

export interface Environment {
  NODE_ENV: string;

  MNEMONIC: string;

  BSC_URL: string;
  ROPSTEN_URL: string;
  RINKEBY_URL: string;
  AVALANCHE_FUJI_URL: string;

  ETHERSCAN_API_KEY: string;
  REPORT_GAS: string;

  KARMA_TOKEN_SUPPLY: string;
  KARMA_TOKEN_ADDRESS: string;

  DEPLOYER_PK: string;
  KEEPER_PK: string;
  UPGRADER_PK: string;
  REWARDER_PK: string;
}

export const ENVIRONMENT = {
  NODE_ENV: configKey("NODE_ENV"),
  MNEMONIC: configKey("MNEMONIC"),

  NETWORKS: {
    BSC: {
      URL: configKey("BSC_URL"),
    },
    ROPSTEN: {
      URL: configKey("ROPSTEN_URL"),
    },
    RINKEBY: {
      URL: configKey("RINKEBY_URL"),
    },
    AVALANCHE_FUJI: {
      URL: configKey("AVALANCHE_FUJI_URL"),
    },
  },
  ETHERSCAN: {
    API_KEY: configKey("ETHERSCAN_API_KEY"),
  },
  REPORT: {
    REPORT_GAS: configKey("REPORT_GAS", boolParser),
  },

  DEPLOYER_PK: configKey("DEPLOYER_PK"),
  KEEPER_PK: configKey("KEEPER_PK"),
  UPGRADER_PK: configKey("UPGRADER_PK"),
  REWARDER_PK: configKey("REWARDER_PK"),

  KARMA_TOKEN: {
    SUPPLY: configKey("KARMA_TOKEN_SUPPLY"),
    ADDRESS: configKey("KARMA_TOKEN_ADDRESS"),
  },
};
