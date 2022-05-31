import { HardhatEthersHelpers } from "@nomiclabs/hardhat-ethers/types";

export async function resetNetwork(ethers: HardhatEthersHelpers) {
  await ethers.provider.send("hardhat_reset", []);
}

export async function setNextBlockTimestamp(ethers: HardhatEthersHelpers, time: number, mine: boolean = false) {
  await ethers.provider.send("evm_setNextBlockTimestamp", [time]);
  if (mine) await ethers.provider.send("evm_mine", []);
}
