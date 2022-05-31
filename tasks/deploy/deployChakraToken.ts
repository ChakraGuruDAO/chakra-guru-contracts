import { task } from "hardhat/config";

task("deploy:chakra", "Deploy CHAKRA ERC20", async (taskArgs, hre) => {
  const { ethers } = hre;

  await hre.run("compile");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const ChakraToken = await ethers.getContractFactory("ChakraToken");
  const chakraToken = await ChakraToken.connect(deployer).deploy();

  await chakraToken.deployed();

  console.log("CHAKRA Token address:", chakraToken.address);
});
