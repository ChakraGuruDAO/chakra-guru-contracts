import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const KarmaToken = await ethers.getContractFactory("Karma");
  const karmaToken = await KarmaToken.connect(deployer).deploy();

  await karmaToken.deployed();

  console.log("Karma Token address:", karmaToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
