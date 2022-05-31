import { utils, Wallet } from "ethers";
import { task, types } from "hardhat/config";
import { generatePKs } from "~/utils/configInit";

task("generateWallet", "Generate new Wallet with pk")
  .addOptionalParam("count", "Count of addresses to generate", 1, types.int)
  .setAction(async (taskArgs, hre) => {
    const pks = generatePKs(taskArgs.count || 1);

    pks.forEach((pk, index) => {
      const address = new Wallet(pk).address;
      console.log(`ADDRESS [${index}]: ${address}`);
      console.log(`PRIVATE KEY [${index}]: ${pk}\n`);
    });
  });
