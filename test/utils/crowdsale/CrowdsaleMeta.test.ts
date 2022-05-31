import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { emptyAddress, resetNetwork } from "~/test/_base";
import * as Contracts from "~/typechain";

describe("KarmaToken", function () {
  let CrowdsaleMeta: Contracts.CrowdsaleMetaMock__factory;
  let crowdsaleMeta: Contracts.CrowdsaleMetaMock;
  let [deployer, alice, bob]: SignerWithAddress[] = [];

  before(async () => {
    [deployer, alice, bob] = await ethers.getSigners();
    CrowdsaleMeta = await ethers.getContractFactory("CrowdsaleMetaMock");
  });

  beforeEach(async () => {
    await resetNetwork(ethers);

    crowdsaleMeta = await CrowdsaleMeta.connect(deployer).deploy();
    await crowdsaleMeta.deployed();
  });

  describe("Config", () => {
    it("set sale token correct", async () => {
      const karmaToken = await ethers
        .getContractFactory("KarmaToken")
        .then((factory) => factory.deploy())
        .then((type) => type.deployed());

      await expect(crowdsaleMeta.setSaleToken(karmaToken.address)).emit(crowdsaleMeta, "CrowdsaleSaleTokenUpdated").withArgs(karmaToken.address);
      expect(await crowdsaleMeta.getSaleToken()).equals(karmaToken.address);
    });

    it("set sale token fail", async () => {
      await expect(crowdsaleMeta.setSaleToken(emptyAddress())).revertedWith("saleToken address is empty");
      await expect(crowdsaleMeta.setSaleToken(alice.address)).revertedWith("saleToken address is not contract");
    });

    it("set raise token correct", async () => {
      const fakeUSDToken = await ethers
        .getContractFactory("FakeUSDToken")
        .then((factory) => factory.deploy())
        .then((type) => type.deployed());

      await expect(crowdsaleMeta.setRaiseToken(fakeUSDToken.address)).emit(crowdsaleMeta, "CrowdsaleRaiseTokenUpdated").withArgs(fakeUSDToken.address);
      expect(await crowdsaleMeta.getRaiseToken()).equals(fakeUSDToken.address);
    });

    it("set raise token fail", async () => {
      await expect(crowdsaleMeta.setRaiseToken(emptyAddress())).revertedWith("raiseToken address is empty");
      await expect(crowdsaleMeta.setRaiseToken(alice.address)).revertedWith("raiseToken address is not contract");
    });

    it("set rate correct", async () => {
      await expect(crowdsaleMeta.setRate(5)).emit(crowdsaleMeta, "CrowdsaleRateUpdated").withArgs(5);
      expect(await crowdsaleMeta.getRate()).equals(5);
    });

    it("set rate fail", async () => {
      await expect(crowdsaleMeta.setRate(0)).revertedWith("rate is wrong");
    });

    it("calculate rate", async () => {
      await crowdsaleMeta.setRate(20);

      expect(await crowdsaleMeta.getSaleAmountFromRaiseAmount(1000)).equals(20 * 1000);
      expect(await crowdsaleMeta.getRaiseAmountFromSaleAmount(1000)).equals(50);
    });
  });
});
