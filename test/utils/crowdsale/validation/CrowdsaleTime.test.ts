import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { emptyAddress, resetNetwork, setNextBlockTimestamp, Time } from "~/test/_base";
import * as Contracts from "~/typechain";

describe("CrowdsaleTime", function () {
  let CrowdsaleTime: Contracts.CrowdsaleTimeMock__factory;
  let crowdsaleTime: Contracts.CrowdsaleTimeMock;
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

    await crowdsaleTime.setRate(20);
    await crowdsaleTime.setSaleToken(saleToken.address);
    await crowdsaleTime.setRaiseToken(raiseToken.address);
    await crowdsaleTime.setRaiseWallet(bob.address);

    const saleTokensInCrowdsale = 10000;
    const buyRaiseTokensAmount = 400;
    const buySaleTokensAmount = rate * buyRaiseTokensAmount;

    await saleToken.transfer(crowdsaleTime.address, saleTokensInCrowdsale);

    await raiseToken.transfer(alice.address, buyRaiseTokensAmount);
    await raiseToken.connect(alice).approve(crowdsaleTime.address, buyRaiseTokensAmount);

    return { saleToken, raiseToken, saleTokensInCrowdsale, buyRaiseTokensAmount, buySaleTokensAmount };
  }

  async function prepareTiming() {
    const [genesisTime, openingTime, middleTime, closingTime, afterTime] = [Time().hours(1), Time().hours(2), Time().hours(3), Time().hours(4), Time().hours(5)];
    return {
      genesisTime,
      openingTime,
      middleTime,
      closingTime,
      afterTime,
    };
  }

  before(async () => {
    [deployer, alice, bob] = await ethers.getSigners();
    CrowdsaleTime = await ethers.getContractFactory("CrowdsaleTimeMock");
  });

  beforeEach(async () => {
    await resetNetwork(ethers);

    crowdsaleTime = await CrowdsaleTime.connect(deployer).deploy();
    await crowdsaleTime.deployed();
  });

  describe("Set config", () => {
    it("set open time fail", async () => {
      await expect(crowdsaleTime.setOpeningTime(0)).revertedWith("opening time is wrong");

      await setNextBlockTimestamp(ethers, Time().hours(6).toNumber(), true);
      await expect(crowdsaleTime.setOpeningTime(Time().days(-10).toNumber())).revertedWith("opening time is wrong");
    });

    it("set open time success", async () => {
      await setNextBlockTimestamp(ethers, Time().hours(1).toNumber(), true);

      const time = Time().hours(1).minutes(1).toNumber();
      await crowdsaleTime.setOpeningTime(time);
      expect(await crowdsaleTime.getOpeningTime()).equals(time);
    });

    it("set close time fail", async () => {
      await expect(crowdsaleTime.setClosingTime(Time().toNumber())).revertedWith("opening time is not set");

      await setNextBlockTimestamp(ethers, Time().hours(1).toNumber(), true);
      const time = Time().hours(1).minutes(1).toNumber();
      await crowdsaleTime.setOpeningTime(time);

      await expect(crowdsaleTime.setClosingTime(Time().days(-10).toNumber())).revertedWith("closing time is wrong");
      await expect(crowdsaleTime.setClosingTime(time)).revertedWith("closing time is wrong");
    });

    it("set close time success", async () => {
      await setNextBlockTimestamp(ethers, Time().hours(1).toNumber(), true);
      const openingTime = Time().hours(1).minutes(1);
      await crowdsaleTime.setOpeningTime(openingTime.toNumber());

      const closingTime = openingTime.days(1);
      await crowdsaleTime.setClosingTime(closingTime.toNumber());
      expect(await crowdsaleTime.getClosingTime()).equals(closingTime.toNumber());
    });

    it("check before open", async () => {
      const { genesisTime, openingTime, middleTime, closingTime, afterTime } = await prepareTiming();

      await setNextBlockTimestamp(ethers, genesisTime.toNumber(), true);
      await crowdsaleTime.setOpeningTime(openingTime.toNumber());
      await crowdsaleTime.setClosingTime(closingTime.toNumber());

      expect(await crowdsaleTime.isOpenByTime()).equals(false);
      expect(await crowdsaleTime.isFinishedByTime()).equals(false);

      await setNextBlockTimestamp(ethers, openingTime.toNumber(), true);
      expect(await crowdsaleTime.isOpenByTime()).equals(true);
      expect(await crowdsaleTime.isFinishedByTime()).equals(false);

      await setNextBlockTimestamp(ethers, middleTime.toNumber(), true);
      expect(await crowdsaleTime.isOpenByTime()).equals(true);
      expect(await crowdsaleTime.isFinishedByTime()).equals(false);

      await setNextBlockTimestamp(ethers, closingTime.toNumber(), true);
      expect(await crowdsaleTime.isOpenByTime()).equals(false);
      expect(await crowdsaleTime.isFinishedByTime()).equals(true);

      await setNextBlockTimestamp(ethers, afterTime.toNumber(), true);
      expect(await crowdsaleTime.isOpenByTime()).equals(false);
      expect(await crowdsaleTime.isFinishedByTime()).equals(true);
    });
  });

  describe("buy tokens", () => {
    it("buy tokens before", async () => {
      const { saleToken, raiseToken, buyRaiseTokensAmount } = await prepareBuy();
      const { genesisTime, openingTime, middleTime, closingTime, afterTime } = await prepareTiming();

      await setNextBlockTimestamp(ethers, genesisTime.toNumber(), true);
      await crowdsaleTime.setOpeningTime(openingTime.toNumber());
      await crowdsaleTime.setClosingTime(closingTime.toNumber());

      await expect(crowdsaleTime.connect(alice).buyTokens(alice.address, buyRaiseTokensAmount)).revertedWith("crowdsale is closed");
    });

    it("buy tokens when open", async () => {
      const { saleToken, raiseToken, buySaleTokensAmount, buyRaiseTokensAmount } = await prepareBuy();
      const { genesisTime, openingTime, middleTime, closingTime, afterTime } = await prepareTiming();

      await setNextBlockTimestamp(ethers, genesisTime.toNumber(), true);
      await crowdsaleTime.setOpeningTime(openingTime.toNumber());
      await crowdsaleTime.setClosingTime(closingTime.toNumber());
      await setNextBlockTimestamp(ethers, openingTime.toNumber(), true);

      await crowdsaleTime.connect(alice).buyTokens(alice.address, buyRaiseTokensAmount);
      expect(await saleToken.balanceOf(alice.address)).equals(buySaleTokensAmount);
    });

    it("buy tokens after", async () => {
      const { saleToken, raiseToken, buySaleTokensAmount, buyRaiseTokensAmount } = await prepareBuy();
      const { genesisTime, openingTime, middleTime, closingTime, afterTime } = await prepareTiming();

      await setNextBlockTimestamp(ethers, genesisTime.toNumber(), true);
      await crowdsaleTime.setOpeningTime(openingTime.toNumber());
      await crowdsaleTime.setClosingTime(closingTime.toNumber());
      await setNextBlockTimestamp(ethers, closingTime.toNumber(), true);

      await expect(crowdsaleTime.connect(alice).buyTokens(alice.address, buyRaiseTokensAmount)).revertedWith("crowdsale is closed");
    });
  });
});
