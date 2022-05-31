import { getConfigKey, boolParser, numberParser } from "./env";

const configKey = getConfigKey<Environment>();

export interface Environment {
  DEPLOYER_PK: string;
  OTHER_PK_COUNT: string;

  REPORT_GAS: string;
  ETHERSCAN_KEY_BSC: string;
}

export const ENVIRONMENT = {
  DEPLOYER_PK: configKey("DEPLOYER_PK"),
  OTHER_PK_COUNT: configKey("OTHER_PK_COUNT", numberParser),

  REPORT_GAS: configKey("REPORT_GAS", boolParser),
  ETHERSCAN: {
    BSC: configKey("ETHERSCAN_KEY_BSC"),
  },
};
