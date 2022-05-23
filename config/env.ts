import { boolParser, getConfigKey } from "../helpers/config";

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

  KARMA_TOKEN: {
    SUPPLY: configKey("KARMA_TOKEN_SUPPLY"),
    ADDRESS: configKey("KARMA_TOKEN_ADDRESS"),
  },
};
