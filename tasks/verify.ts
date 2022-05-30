import { task } from "hardhat/config";

task("verify", "Verify").setAction(async (taskArgs, hre, runSuper) => {
  // let network = hre.config.networks[taskArgs.fork];
  // if (network && "url" in network) {
  //   console.log(`Forking ${taskArgs.fork} from RPC: ${network.url}`);
  //   taskArgs.noReset = true;
  //   taskArgs.fork = network.url;
  //   if (network.chainId) {
  //     hre.config.networks.hardhat.chainId = network.chainId;
  //     hre.config.networks.localhost.chainId = network.chainId;
  //   }
  // }
  console.log("hi");
  await runSuper(taskArgs);
});
