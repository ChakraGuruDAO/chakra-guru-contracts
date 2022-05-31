import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import * as Contracts from "~/typechain";
import { Duration, resetNetwork, Time } from "../_base";

describe("KarmaPrivateCrowdsale", function () {
  let KarmaPrivateCrowdsale: Contracts.KarmaPrivateCrowdsale__factory;
  let karmaPrivateCrowdsale: Contracts.KarmaPrivateCrowdsale;
  let [deployer, alice, bob, karl]: SignerWithAddress[] = [];
  let saleToken: Contracts.KarmaToken;
  let raiseToken: Contracts.FakeUSDToken;
  let karmaPrivateSaleVestingVault: Contracts.KarmaPrivateSaleVestingVault;

  async function deployTokens() {
    saleToken = await ethers
      .getContractFactory("KarmaToken")
      .then((factory) => factory.deploy())
      .then((type) => type.deployed());

    raiseToken = await ethers
      .getContractFactory("FakeUSDToken")
      .then((factory) => factory.deploy())
      .then((type) => type.deployed());
  }

  async function getConfigInfo() {
    const zeroDate = Time().hours(10).toNumber();
    const vestingPortionsUnlockTime = [Duration().toNumber(), Duration().hours(1).toNumber(), Duration().hours(2).toNumber(), Duration().hours(3).toNumber()];
    const vestingPercentPerPortion = [10000, 0, 45000, 45000];
    const vestingPercentPrecision = 100000;

    karmaPrivateSaleVestingVault = await ethers
      .getContractFactory("KarmaPrivateSaleVestingVault")
      .then((factory) => factory.deploy(saleToken.address, vestingPortionsUnlockTime, vestingPercentPerPortion, vestingPercentPrecision))
      .then((type) => type.deployed());
    await karmaPrivateSaleVestingVault.deployed();
  }

  before(async () => {
    [deployer, alice, bob, karl] = await ethers.getSigners();
    KarmaPrivateCrowdsale = await ethers.getContractFactory("KarmaPrivateCrowdsale");
  });
  beforeEach(async () => {
    await resetNetwork(ethers);

    await deployTokens();
    await getConfigInfo();

    karmaPrivateCrowdsale = await KarmaPrivateCrowdsale.deploy(saleToken.address, raiseToken.address, bob.address);
    await karmaPrivateCrowdsale.deployed();
  });

  it("test", async function () {});
});
