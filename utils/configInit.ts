import { BigNumber, ethers, Wallet } from "ethers";
import { HardhatNetworkAccountUserConfig } from "hardhat/types/config";
import { ENVIRONMENT } from "./env.config";

export const startingEtherPerAccount = ethers.utils.parseUnits(BigNumber.from(1_000_000_000).toString(), "ether");

export const getPKs = () => {
  let deployerAccount: string;
  let otherAccounts: string[];

  // PKs without `0x` prefix
  if (ENVIRONMENT.DEPLOYER_PK) deployerAccount = ENVIRONMENT.DEPLOYER_PK;

  otherAccounts = generatePKs(ENVIRONMENT.OTHER_PK_COUNT);

  const accounts = [deployerAccount, ...otherAccounts].filter((pk) => !!pk) as string[];
  return accounts;
};

export const buildHardhatNetworkAccount = (accounts: string[]): HardhatNetworkAccountUserConfig[] => {
  return accounts.map<HardhatNetworkAccountUserConfig>((pk) => ({
    privateKey: pk,
    balance: startingEtherPerAccount.toString(),
  }));
};

export const generatePKs = (count: number = 1): string[] => {
  const addresses = Array.apply(null, Array(count)).map(() => {
    const { address, privateKey } = Wallet.createRandom();
    return { address, privateKey };
  });

  return addresses.map((m) => m.privateKey);
};
