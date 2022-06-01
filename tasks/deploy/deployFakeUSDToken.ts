import { BigNumber } from "ethers";
import { task } from "hardhat/config";

task("deploy:fake_usd", "Deploy FAKE USD ERC20", async (taskArgs, hre) => {
  const { ethers } = hre;

  await hre.run("compile");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const FakeUSDToken = await ethers.getContractFactory("FakeUSDToken");
  const fakeUSDToken = await FakeUSDToken.connect(deployer).deploy();

  await fakeUSDToken.deployed();

  console.log("KARMA Token address:", fakeUSDToken.address);
});
