import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { emptyAddress, resetNetwork } from "~/test/_base";
import * as Contracts from "~/typechain";

describe("CrowdsaleLimitter", function () {
  let CrowdsaleLimitter: Contracts.CrowdsaleLimitterMock__factory;
  let crowdsaleLimitter: Contracts.CrowdsaleLimitterMock;
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

    await crowdsaleLimitter.setRate(20);
    await crowdsaleLimitter.setSaleToken(saleToken.address);
    await crowdsaleLimitter.setRaiseToken(raiseToken.address);
    await crowdsaleLimitter.setRaiseWallet(bob.address);

    const saleTokensInCrowdsale = 10000;
    const buyRaiseTokensAmount = 400;
    const buySaleTokensAmount = rate * buyRaiseTokensAmount;

    await saleToken.transfer(crowdsaleLimitter.address, saleTokensInCrowdsale);

    await raiseToken.transfer(alice.address, buyRaiseTokensAmount);
    await raiseToken.connect(alice).approve(crowdsaleLimitter.address, buyRaiseTokensAmount);

    return { saleToken, raiseToken, saleTokensInCrowdsale, buyRaiseTokensAmount, buySaleTokensAmount };
  }

  before(async () => {
    [deployer, alice, bob] = await ethers.getSigners();
    CrowdsaleLimitter = await ethers.getContractFactory("CrowdsaleLimitterMock");
  });

  beforeEach(async () => {
    await resetNetwork(ethers);

    crowdsaleLimitter = await CrowdsaleLimitter.connect(deployer).deploy();
    await crowdsaleLimitter.deployed();
  });

  describe("Set config", () => {
    it("set limits fail", async () => {
      await expect(crowdsaleLimitter.setMinSaleLimit(0)).revertedWith("min sale limit is wrong");
      await expect(crowdsaleLimitter.setMaxSaleLimit(0)).revertedWith("max sale limit is wrong");

      await crowdsaleLimitter.setMinSaleLimit(100);
      await expect(crowdsaleLimitter.setMaxSaleLimit(90)).revertedWith("max sale limit is wrong");
    });

    it("set limits success", async () => {
      await crowdsaleLimitter.setMinSaleLimit(100);
      await crowdsaleLimitter.setMaxSaleLimit(1000);

      const limitters = await crowdsaleLimitter.getSaleLimit();

      expect(limitters[0]).equals(100);
      expect(limitters.minSaleLimit).equals(100);

      expect(limitters[1]).equals(1000);
      expect(limitters.maxSaleLimit).equals(1000);
    });

    describe("buy tokens", () => {
      it("buy tokens before min limit", async () => {
        const { saleToken, raiseToken, buySaleTokensAmount, buyRaiseTokensAmount } = await prepareBuy();

        await crowdsaleLimitter.setMinSaleLimit(buySaleTokensAmount + 1);
        await expect(crowdsaleLimitter.connect(alice).buyTokens(alice.address, buyRaiseTokensAmount)).revertedWith("beneficiary's limit exceeded");
      });

      it("buy tokens after max limit", async () => {
        const { saleToken, raiseToken, buySaleTokensAmount, buyRaiseTokensAmount } = await prepareBuy();

        await crowdsaleLimitter.setMaxSaleLimit(buySaleTokensAmount - 1);
        await expect(crowdsaleLimitter.connect(alice).buyTokens(alice.address, buyRaiseTokensAmount)).revertedWith("beneficiary's limit exceeded");
      });

      it("buy tokens success", async () => {
        const { saleToken, raiseToken, buySaleTokensAmount, buyRaiseTokensAmount } = await prepareBuy();

        await crowdsaleLimitter.setMinSaleLimit(buySaleTokensAmount - 1);
        await crowdsaleLimitter.setMaxSaleLimit(buySaleTokensAmount + 1);

        await crowdsaleLimitter.connect(alice).buyTokens(alice.address, buyRaiseTokensAmount);
        expect(await saleToken.balanceOf(alice.address)).equals(buySaleTokensAmount);

        expect(await crowdsaleLimitter.getContribution(alice.address)).equals(buySaleTokensAmount);
      });

      it("double limit buy tokens fail", async () => {
        const { saleToken, raiseToken, buySaleTokensAmount, buyRaiseTokensAmount } = await prepareBuy();

        await crowdsaleLimitter.setMinSaleLimit(buySaleTokensAmount - 1);
        await crowdsaleLimitter.setMaxSaleLimit(buySaleTokensAmount + 1);

        await crowdsaleLimitter.connect(alice).buyTokens(alice.address, buyRaiseTokensAmount);
        expect(await saleToken.balanceOf(alice.address)).equals(buySaleTokensAmount);
        await expect(crowdsaleLimitter.connect(alice).buyTokens(alice.address, buyRaiseTokensAmount)).revertedWith("beneficiary's limit exceeded");
      });
    });
  });
});
