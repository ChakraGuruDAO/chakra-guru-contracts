import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { emptyAddress, resetNetwork } from "~/test/_base";
import * as Contracts from "~/typechain";

describe("CrowdsaleCapped", function () {
  let CrowdsaleCapped: Contracts.CrowdsaleCappedMock__factory;
  let crowdsaleCapped: Contracts.CrowdsaleCappedMock;
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

    await crowdsaleCapped.setRate(20);
    await crowdsaleCapped.setSaleToken(saleToken.address);
    await crowdsaleCapped.setRaiseToken(raiseToken.address);
    await crowdsaleCapped.setRaiseWallet(bob.address);

    const saleTokensInCrowdsale = 10000;
    const buyRaiseTokensAmount = 400;
    const buySaleTokensAmount = rate * buyRaiseTokensAmount;

    await saleToken.transfer(crowdsaleCapped.address, saleTokensInCrowdsale);

    await raiseToken.transfer(alice.address, buyRaiseTokensAmount);
    await raiseToken.connect(alice).approve(crowdsaleCapped.address, buyRaiseTokensAmount);

    return { saleToken, raiseToken, saleTokensInCrowdsale, buyRaiseTokensAmount, buySaleTokensAmount };
  }

  before(async () => {
    [deployer, alice, bob] = await ethers.getSigners();
    CrowdsaleCapped = await ethers.getContractFactory("CrowdsaleCappedMock");
  });

  beforeEach(async () => {
    await resetNetwork(ethers);

    crowdsaleCapped = await CrowdsaleCapped.connect(deployer).deploy();
    await crowdsaleCapped.deployed();
  });

  describe("Set config", () => {
    it("set caps fail", async () => {
      await expect(crowdsaleCapped.setMinSaleCap(0)).revertedWith("min sale cap is wrong");
      await expect(crowdsaleCapped.setMaxSaleCap(0)).revertedWith("max sale cap is wrong");

      await crowdsaleCapped.setMinSaleCap(100);
      await expect(crowdsaleCapped.setMaxSaleCap(90)).revertedWith("max sale cap is wrong");
    });

    it("set caps success", async () => {
      await crowdsaleCapped.setMinSaleCap(100);
      await crowdsaleCapped.setMaxSaleCap(1000);

      const limitters = await crowdsaleCapped.getSaleCap();

      expect(limitters[0]).equals(100);
      expect(limitters.minSaleCap).equals(100);

      expect(limitters[1]).equals(1000);
      expect(limitters.maxSaleCap).equals(1000);
    });

    describe("buy tokens", () => {
      it("buy tokens before min cap", async () => {
        const { saleToken, raiseToken, buySaleTokensAmount, buyRaiseTokensAmount } = await prepareBuy();

        await crowdsaleCapped.setMinSaleCap(buySaleTokensAmount + 1);
        await crowdsaleCapped.setMaxSaleCap(buySaleTokensAmount + 100);
        await crowdsaleCapped.connect(alice).buyTokens(alice.address, buyRaiseTokensAmount);

        const cap = await crowdsaleCapped.capReached();
        expect(cap[0]).equals(false);
        expect(cap.minSaleCapReached).equals(false);

        expect(cap[1]).equals(false);
        expect(cap.maxSaleCapReached).equals(false);
      });

      it("buy tokens after max limit", async () => {
        const { saleToken, raiseToken, buySaleTokensAmount, buyRaiseTokensAmount } = await prepareBuy();

        await crowdsaleCapped.setMaxSaleCap(1);
        await crowdsaleCapped.setMaxSaleCap(buySaleTokensAmount - 1);
        await expect(crowdsaleCapped.connect(alice).buyTokens(alice.address, buyRaiseTokensAmount)).revertedWith("cap exceeded");
      });

      it("buy tokens success", async () => {
        const { saleToken, raiseToken, buySaleTokensAmount, buyRaiseTokensAmount } = await prepareBuy();

        await crowdsaleCapped.setMinSaleCap(buySaleTokensAmount - 1);
        await crowdsaleCapped.setMaxSaleCap(buySaleTokensAmount + 1);

        await crowdsaleCapped.connect(alice).buyTokens(alice.address, buyRaiseTokensAmount);
        expect(await saleToken.balanceOf(alice.address)).equals(buySaleTokensAmount);

        const cap = await crowdsaleCapped.capReached();
        expect(cap[0]).equals(true);
        expect(cap.minSaleCapReached).equals(true);

        expect(cap[1]).equals(false);
        expect(cap.maxSaleCapReached).equals(false);
      });
    });
  });
});
