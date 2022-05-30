import { BigNumber, ethers } from "ethers";
import { HardhatNetworkAccountUserConfig } from "hardhat/types/config";
import { ENVIRONMENT } from "./env";

export const startingEtherPerAccount = ethers.utils.parseUnits(
  BigNumber.from(1_000_000_000).toString(),
  "ether"
);

export const getPKs = () => {
  let deployerAccount, keeperAccount, upgraderAccount, rewarderAccount;

  // PKs without `0x` prefix
  if (ENVIRONMENT.DEPLOYER_PK) deployerAccount = ENVIRONMENT.DEPLOYER_PK;
  if (ENVIRONMENT.KEEPER_PK) keeperAccount = ENVIRONMENT.KEEPER_PK;
  if (ENVIRONMENT.UPGRADER_PK) upgraderAccount = ENVIRONMENT.UPGRADER_PK;
  if (ENVIRONMENT.REWARDER_PK) rewarderAccount = ENVIRONMENT.REWARDER_PK;

  const accounts = [
    deployerAccount,
    keeperAccount,
    upgraderAccount,
    rewarderAccount,
  ].filter((pk) => !!pk) as string[];
  return accounts;
};

export const buildHardhatNetworkAccount = (accounts: string[]) => {
  const hardhatAccounts = accounts.map((pk) => {
    // hardhat network wants 0x prefix in front of PK
    const accountConfig: HardhatNetworkAccountUserConfig = {
      privateKey: pk,
      balance: startingEtherPerAccount.toString(),
    };
    return accountConfig;
  });

  return hardhatAccounts;
};
