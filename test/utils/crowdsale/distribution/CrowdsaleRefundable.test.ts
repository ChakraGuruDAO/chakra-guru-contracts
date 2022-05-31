import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { emptyAddress, resetNetwork } from "~/test/_base";
import * as Contracts from "~/typechain";

describe("CrowdsaleRefundable", function () {
  let CrowdsaleRefundable: Contracts.CrowdsaleRefundableMock__factory;
  let crowdsaleRefundable: Contracts.CrowdsaleRefundableMock;
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

  async function prepareBuy() {
    const { saleToken, raiseToken } = await deployTokens();
    const rate = 20;

    await crowdsaleRefundable.setRate(rate);
    await crowdsaleRefundable.setSaleToken(saleToken.address);
    await crowdsaleRefundable.setRaiseToken(raiseToken.address);
    await crowdsaleRefundable.setRaiseWallet(bob.address);

    const saleTokensInCrowdsale = 10000;
    const buyRaiseTokensAmount = 400;
    const buySaleTokensAmount = rate * buyRaiseTokensAmount;

    await saleToken.transfer(crowdsaleRefundable.address, saleTokensInCrowdsale);

    await raiseToken.transfer(alice.address, buyRaiseTokensAmount);
    await raiseToken.connect(alice).approve(crowdsaleRefundable.address, buyRaiseTokensAmount);

    return { saleToken, raiseToken, saleTokensInCrowdsale, buyRaiseTokensAmount, buySaleTokensAmount };
  }

  before(async () => {
    [deployer, alice, bob] = await ethers.getSigners();
    CrowdsaleRefundable = await ethers.getContractFactory("CrowdsaleRefundableMock");
  });

  beforeEach(async () => {
    await resetNetwork(ethers);

    crowdsaleRefundable = await CrowdsaleRefundable.connect(deployer).deploy();
    await crowdsaleRefundable.deployed();
  });

  describe("check refundable", () => {
    it("check if goal reached", async () => {
      const { buyRaiseTokensAmount, buySaleTokensAmount } = await prepareBuy();

      expect(await crowdsaleRefundable.canRefundable()).equals(false);
      // await crowdsaleRefundable.connect(alice).buyTokens(alice.address, buyRaiseTokensAmount);
      // expect(await crowdsaleRefundable.canRefundable()).equals(false);

      await crowdsaleRefundable.setGoalReached(true);
      await crowdsaleRefundable.setFinished(true);
      expect(await crowdsaleRefundable.canRefundable()).equals(false);
    });

    it("check if goal not reached", async () => {
      const { buyRaiseTokensAmount, buySaleTokensAmount } = await prepareBuy();

      await crowdsaleRefundable.setGoalReached(false);
      await crowdsaleRefundable.setFinished(true);
      expect(await crowdsaleRefundable.canRefundable()).equals(true);
    });

    it("check if goal reached but not finished", async () => {
      const { buyRaiseTokensAmount, buySaleTokensAmount } = await prepareBuy();

      await crowdsaleRefundable.setGoalReached(true);
      await crowdsaleRefundable.setFinished(false);
      expect(await crowdsaleRefundable.canRefundable()).equals(false);
    });

    it("check withdraw disabled if goal reached", async () => {
      const { buyRaiseTokensAmount, buySaleTokensAmount } = await prepareBuy();

      await crowdsaleRefundable.connect(alice).buyTokens(alice.address, buyRaiseTokensAmount);
      await crowdsaleRefundable.setGoalReached(true);
      await crowdsaleRefundable.setFinished(true);

      await expect(crowdsaleRefundable.withdrawFunds()).revertedWith("can not refundable");
    });

    it("check withdraw disabled if goal not reached & no buy tokens", async () => {
      const { buyRaiseTokensAmount, buySaleTokensAmount } = await prepareBuy();

      await crowdsaleRefundable.setGoalReached(false);
      await crowdsaleRefundable.setFinished(true);

      await expect(crowdsaleRefundable.withdrawFunds()).revertedWith("not amount refundable");
    });

    it("check withdraw disabled if goal not reached & buy tokens", async () => {
      const { buyRaiseTokensAmount, buySaleTokensAmount } = await prepareBuy();

      await crowdsaleRefundable.connect(alice).buyTokens(alice.address, buyRaiseTokensAmount);
      await crowdsaleRefundable.setGoalReached(false);
      await crowdsaleRefundable.setFinished(true);

      await expect(crowdsaleRefundable.connect(alice).withdrawFunds()).revertedWith("ERC20: insufficient allowance");
    });

    it("check withdraw disabled if goal not reached & buy tokens & approve from raise wallet", async () => {
      const { raiseToken, buyRaiseTokensAmount, buySaleTokensAmount } = await prepareBuy();

      await crowdsaleRefundable.connect(alice).buyTokens(alice.address, buyRaiseTokensAmount);
      await crowdsaleRefundable.setGoalReached(false);
      await crowdsaleRefundable.setFinished(true);

      await raiseToken.connect(bob).approve(crowdsaleRefundable.address, buyRaiseTokensAmount);

      expect(await raiseToken.balanceOf(alice.address)).equals(0);
      await crowdsaleRefundable.connect(alice).withdrawFunds();
      expect(await raiseToken.balanceOf(alice.address)).equals(buyRaiseTokensAmount);
    });
  });
});
