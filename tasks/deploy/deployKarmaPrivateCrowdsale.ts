import { task, types } from "hardhat/config";

task("deploy:karma_private_sale_crowdsale", "Deploy KARMA Private sale Crowdsale")
  .addParam("karmatoken", "KARMA Token address", null, types.string)
  .addParam("raisetoken", "BUSD Token address", null, types.string)
  .addParam("raisewallet", "BUSD Raise Token address", null, types.string)
  .addParam("vestingvault", "Vesting Vault", null, types.string)
  .setAction(async (taskArgs, hre) => {
    const { ethers } = hre;
    const { karmatoken, raisetoken, raisewallet, vestingvault } = taskArgs;

    await hre.run("compile");

    const [deployer] = await ethers.getSigners();
    console.log("Deployer:", deployer.address);

    const KarmaPrivateCrowdsale = await ethers.getContractFactory("KarmaPrivateCrowdsale");
    const karmaPrivateCrowdsale = await KarmaPrivateCrowdsale.connect(deployer).deploy(karmatoken, raisetoken, raisewallet);

    await karmaPrivateCrowdsale.deployed();
    console.log("KARMA Private sale Crowdsale address:", karmaPrivateCrowdsale.address);

    await karmaPrivateCrowdsale.setVestingVault(vestingvault);
    console.log("Setted vesting vault");

    const KarmaPrivateSaleVestingVault = await ethers.getContractFactory("KarmaPrivateSaleVestingVault");

    const karmaPrivateSaleVestingVault = KarmaPrivateSaleVestingVault.connect(deployer).attach(vestingvault);
    await karmaPrivateSaleVestingVault.grantRole(await karmaPrivateSaleVestingVault.BENEFICIARY_MANAGE_ROLE(), karmaPrivateCrowdsale.address);
    console.log("Granted role by sale vesting for crowdsale");
  });
