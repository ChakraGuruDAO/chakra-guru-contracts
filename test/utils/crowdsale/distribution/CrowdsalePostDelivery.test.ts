import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { Duration, emptyAddress, resetNetwork, Time } from "~/test/_base";
import * as Contracts from "~/typechain";

describe("CrowdsalePostDelivery", function () {
  let CrowdsalePostDelivery: Contracts.CrowdsalePostDeliveryMock__factory;
  let crowdsalePostDelivery: Contracts.CrowdsalePostDeliveryMock;
  let [deployer, alice, bob]: SignerWithAddress[] = [];

  async function deployTokens() {
    const saleToken = await ethers
      .getContractFactory("KarmaToken")
      .then((factory) => factory.deploy())
      .then((type) => type.deployed());

    const raiseToken = await ethers
      .getContractFactory("FakeUSDToken")
      .then((factory) => factory.deploy())
      .then((type) => type.deployed());
    return { saleToken, raiseToken };
  }

  async function getConfigInfo() {
    const zeroDate = Time().hours(1).toNumber();
    const vestingPortionsUnlockTime = [Duration().toNumber(), Duration().hours(1).toNumber(), Duration().hours(2).toNumber(), Duration().hours(3).toNumber()];
    const vestingPercentPerPortion = [10000, 0, 45000, 45000];
    const vestingPercentPrecision = 100000;

    return {
      zeroDate,
      vestingPortionsUnlockTime,
      vestingPercentPerPortion,
      vestingPercentPrecision,
    };
  }

  async function prepareVestingVault(saleToken: Contracts.IERC20) {
    const { zeroDate, vestingPercentPerPortion, vestingPercentPrecision, vestingPortionsUnlockTime } = await getConfigInfo();
    const vestingVault = await ethers
      .getContractFactory("CrowdsalePostDeliveryVestingVaultMock")
      .then((factory) => factory.deploy())
      .then((type) => type.deployed());

    await vestingVault.setInfo(saleToken.address, zeroDate, vestingPortionsUnlockTime, vestingPercentPerPortion, vestingPercentPrecision);
    await vestingVault.changeStatus(1);
    return vestingVault;
  }

  async function prepareBuy(saleToken: Contracts.IERC20, raiseToken: Contracts.IERC20) {
    const rate = 20;

    await crowdsalePostDelivery.setRate(20);
    await crowdsalePostDelivery.setSaleToken(saleToken.address);
    await crowdsalePostDelivery.setRaiseToken(raiseToken.address);
    await crowdsalePostDelivery.setRaiseWallet(bob.address);

    const saleTokensInCrowdsale = 10000;
    const buyRaiseTokensAmount = 400;
    const buySaleTokensAmount = rate * buyRaiseTokensAmount;

    await raiseToken.transfer(alice.address, buyRaiseTokensAmount);
    await raiseToken.connect(alice).approve(crowdsalePostDelivery.address, buyRaiseTokensAmount);

    return { saleTokensInCrowdsale, buyRaiseTokensAmount, buySaleTokensAmount };
  }

  before(async () => {
    [deployer, alice, bob] = await ethers.getSigners();
    CrowdsalePostDelivery = await ethers.getContractFactory("CrowdsalePostDeliveryMock");
  });

  beforeEach(async () => {
    await resetNetwork(ethers);

    crowdsalePostDelivery = await CrowdsalePostDelivery.connect(deployer).deploy();
    await crowdsalePostDelivery.deployed();
  });

  describe("Set config", () => {
    it("set vesting vault fail", async () => {
      await expect(crowdsalePostDelivery.setVestingVault(emptyAddress())).revertedWith("address is empty");
      await expect(crowdsalePostDelivery.setVestingVault(alice.address)).revertedWith("address is not contract");
    });

    it("set vesting vault fail", async () => {
      const { saleToken } = await deployTokens();

      const vestingVault1 = await prepareVestingVault(saleToken);
      await expect(crowdsalePostDelivery.setVestingVault(vestingVault1.address)).emit(crowdsalePostDelivery, "CrowdsaleVestingVaultUpdated").withArgs(vestingVault1.address, emptyAddress());

      const vestingVault2 = await prepareVestingVault(saleToken);
      await expect(crowdsalePostDelivery.setVestingVault(vestingVault2.address)).emit(crowdsalePostDelivery, "CrowdsaleVestingVaultUpdated").withArgs(vestingVault2.address, vestingVault1.address);
    });
  });

  describe("buy tokens", () => {
    it("buy tokens success", async () => {
      const { saleToken, raiseToken } = await deployTokens();
      const vestingVault = await prepareVestingVault(saleToken);
      await crowdsalePostDelivery.setVestingVault(vestingVault.address);
      await vestingVault.grantRole(await vestingVault.BENEFICIARY_MANAGE_ROLE(), crowdsalePostDelivery.address);

      const { buyRaiseTokensAmount, buySaleTokensAmount } = await prepareBuy(saleToken, raiseToken);
      await crowdsalePostDelivery.connect(alice).buyTokens(alice.address, buyRaiseTokensAmount);

      expect(await saleToken.balanceOf(alice.address)).equals(0);

      const benecifiaryInfo = await vestingVault.getBeneficiary(alice.address);

      expect(benecifiaryInfo.amount).equals(buySaleTokensAmount);
      expect(await crowdsalePostDelivery.getBeneficiaryAmount(alice.address)).equals(buySaleTokensAmount);
      expect(await raiseToken.balanceOf(bob.address)).equals(buyRaiseTokensAmount);
    });
  });
});
