import { Wallet } from "ethers";
import { task, types } from "hardhat/config";

task("generateWallet", "Generate new Wallet with pk")
  .addOptionalParam("count", "Count of addresses to generate", 1, types.int)
  .setAction(async (taskArgs, hre) => {
    const addresses = Array.apply(null, Array(taskArgs.count || 1)).map(() => {
      const { address, privateKey } = Wallet.createRandom();
      return { address, privateKey };
    });

    addresses.forEach(({ address, privateKey }, index) => {
      console.log(`ADDRESS [${index}]: ${address}`);
      console.log(`PRIVATE KEY [${index}]: ${privateKey}\n`);
    });
  });
