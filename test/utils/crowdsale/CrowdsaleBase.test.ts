import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { emptyAddress, resetNetwork } from "~/test/_base";
import * as Contracts from "~/typechain";

describe("CrowdsaleBase", function () {
  let CrowdsaleBase: Contracts.CrowdsaleBaseMock__factory;
  let crowdsaleBase: Contracts.CrowdsaleBaseMock;
  let [deployer, alice, bob, karl]: SignerWithAddress[] = [];

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

  before(async () => {
    [deployer, alice, bob, karl] = await ethers.getSigners();
    CrowdsaleBase = await ethers.getContractFactory("CrowdsaleBaseMock");
  });

  beforeEach(async () => {
    await resetNetwork(ethers);

    crowdsaleBase = await CrowdsaleBase.connect(deployer).deploy();
    await crowdsaleBase.deployed();
  });

  describe("Raise wallet", () => {
    it("set raise wallet success", async () => {
      expect(await crowdsaleBase.setRaiseWallet(alice.address))
        .emit(crowdsaleBase, "CrowdsaleRaiseWalletUpdated")
        .withArgs(alice.address);

      expect(await crowdsaleBase.getRaiseWallet()).equals(alice.address);
    });
    it("set raise wallet failed", async () => {
      await expect(crowdsaleBase.setRaiseWallet(emptyAddress())).revertedWith("raiseWallet is empty");
    });
  });

  describe("purchase tokens", () => {
    it("benefeciary empty", async () => {
      await expect(crowdsaleBase.buyTokens(emptyAddress(), 100)).revertedWith("Crowdsale: beneficiary is the zero address");
      await expect(crowdsaleBase.buyTokens(alice.address, 0)).revertedWith("Crowdsale: saleAmount is 0");

      await crowdsaleBase.setRate(20);
      await expect(crowdsaleBase.buyTokens(alice.address, 0)).revertedWith("Crowdsale: saleAmount is 0");
    });
    it("fail purchase because enough money", async () => {
      const { saleToken, raiseToken } = await deployTokens();
      await crowdsaleBase.setRate(20);
      await crowdsaleBase.setSaleToken(saleToken.address);
      await crowdsaleBase.setRaiseToken(raiseToken.address);

      await expect(crowdsaleBase.connect(alice).buyTokens(alice.address, 100)).revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("success buy tokens", async () => {
      const { saleToken, raiseToken } = await deployTokens();
      await crowdsaleBase.setRate(20);
      await crowdsaleBase.setSaleToken(saleToken.address);
      await crowdsaleBase.setRaiseToken(raiseToken.address);
      await crowdsaleBase.setRaiseWallet(karl.address);

      await saleToken.transfer(crowdsaleBase.address, 10000);

      await raiseToken.transfer(alice.address, 1000);
      await raiseToken.connect(alice).approve(crowdsaleBase.address, 1000);

      await expect(crowdsaleBase.connect(alice).buyTokens(bob.address, 400))
        .emit(crowdsaleBase, "CrowdsaleTokensPurchased")
        .withArgs(alice.address, bob.address, 400 * 20, 400);

      expect(await raiseToken.balanceOf(karl.address)).equals(400);
      expect(await raiseToken.balanceOf(alice.address)).equals(600);
      expect(await saleToken.balanceOf(bob.address)).equals(400 * 20);
      expect(await saleToken.balanceOf(crowdsaleBase.address)).equals(10000 - 400 * 20);
    });
  });
});
