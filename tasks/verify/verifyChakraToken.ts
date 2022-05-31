import { task } from "hardhat/config";

task("verify:chakra", "Verify CHAKRA ERC20")
  .addParam("address", "Token address")
  .setAction(async (taskArgs, hre) => {
    const { address } = taskArgs;
    await hre.run("verify:verify", {
      address,
      contract: "contracts/common/ChakraToken.sol:ChakraToken",
      constructorArguments: [],
    });
  });
