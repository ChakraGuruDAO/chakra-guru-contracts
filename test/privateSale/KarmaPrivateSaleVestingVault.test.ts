import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import * as Contracts from "~/typechain";
import { Duration, resetNetwork, Time } from "../_base";

describe("KarmaPrivateSaleVestingVault", function () {
  let KarmaPrivateSaleVestingVault: Contracts.KarmaPrivateSaleVestingVault__factory;
  let karmaPrivateSaleVestingVault: Contracts.KarmaPrivateSaleVestingVault;
  let [deployer, alice, bob, karl]: SignerWithAddress[] = [];

  let saleToken: Contracts.KarmaToken;
  let raiseToken: Contracts.FakeUSDToken;
  let zeroDate: number;
  let vestingPortionsUnlockTime: number[];
  let vestingPercentPerPortion: number[];
  let vestingPercentPrecision: number;

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
    zeroDate = Time().hours(10).toNumber();
    vestingPortionsUnlockTime = [Duration().toNumber(), Duration().hours(1).toNumber(), Duration().hours(2).toNumber(), Duration().hours(3).toNumber()];
    vestingPercentPerPortion = [10000, 0, 45000, 45000];
    vestingPercentPrecision = 100000;
  }

  before(async () => {
    [deployer, alice, bob, karl] = await ethers.getSigners();
    KarmaPrivateSaleVestingVault = await ethers.getContractFactory("KarmaPrivateSaleVestingVault");
  });
  beforeEach(async () => {
    await resetNetwork(ethers);

    await deployTokens();
    await getConfigInfo();
    karmaPrivateSaleVestingVault = await KarmaPrivateSaleVestingVault.deploy(saleToken.address, vestingPortionsUnlockTime, vestingPercentPerPortion, vestingPercentPrecision);
    await karmaPrivateSaleVestingVault.deployed();
  });

  it("test", async function () {});
});
