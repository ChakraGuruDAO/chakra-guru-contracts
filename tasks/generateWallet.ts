import { Wallet } from "ethers";
import { task } from "hardhat/config";

task("generateWallet", "Generate new Wallet with pk", async (taskArgs, hre) => {
  const wallet = Wallet.createRandom();
  console.log("address:", wallet.address);
  console.log("privateKey:", wallet.privateKey);
});
