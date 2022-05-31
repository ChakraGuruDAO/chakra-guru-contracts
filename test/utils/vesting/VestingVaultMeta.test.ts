import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import * as Contracts from "~/typechain";
import { Time, setNextBlockTimestamp, resetNetwork, emptyAddress } from "~/test/_base";

describe("VestingVaultMeta", function () {
  let VestingVaultMeta: Contracts.VestingVaultMetaMock__factory;
  let vestingVaultMeta: Contracts.VestingVaultMetaMock;
  let [deployer, alice, bob]: SignerWithAddress[] = [];

  before(async () => {
    [deployer, alice, bob] = await ethers.getSigners();
    VestingVaultMeta = await ethers.getContractFactory("VestingVaultMetaMock");
  });
  beforeEach(async () => {
    await resetNetwork(ethers);

    vestingVaultMeta = await VestingVaultMeta.connect(deployer).deploy();
    await vestingVaultMeta.deployed();
  });

  describe("Config Stage", () => {
    it("get config stage", async () => {
      expect(await vestingVaultMeta.getStatus()).equals(0);
    });

    it("set token correct", async () => {
      const karmaToken = await ethers
        .getContractFactory("KarmaToken")
        .then((factory) => factory.deploy())
        .then((type) => type.deployed());

      await expect(vestingVaultMeta.setToken(karmaToken.address)).emit(vestingVaultMeta, "VaultTokenChanged").withArgs(karmaToken.address);
      expect(await vestingVaultMeta.getToken()).equals(karmaToken.address);
    });

    it("set token fail", async () => {
      await expect(vestingVaultMeta.setToken(emptyAddress())).revertedWith("address is empty");
      await expect(vestingVaultMeta.setToken(alice.address)).revertedWith("address is not contract");
    });

    it("set zero date correct", async () => {
      const timestamp = Time().hours(3);

      await vestingVaultMeta.setZeroDate(timestamp.toNumber());
      expect(await vestingVaultMeta.getZeroDate()).equals(timestamp.toBN());
    });

    it("set zero date fail", async () => {
      await setNextBlockTimestamp(ethers, Time().hours(6).toNumber(), true);

      await expect(vestingVaultMeta.setZeroDate(Time().days(-10).toNumber())).revertedWith("wrong zero date");
    });

    it("set vesting info correct", async () => {
      const vestingPortionsUnlockTime = [0, 100, 200, 300];
      const vestingPercentPerPortion = [10, 20, 0, 70];
      const vestingPercentPrecision = 100;

      await expect(vestingVaultMeta.setVestingInfo(vestingPortionsUnlockTime, vestingPercentPerPortion, vestingPercentPrecision))
        .emit(vestingVaultMeta, "VaultVestingInfoChanged")
        .withArgs(vestingPortionsUnlockTime, vestingPercentPerPortion, vestingPercentPrecision);

      const info = await vestingVaultMeta.getVestingInfo();

      expect(info[0].map((m) => m.toNumber())).have.all.members(vestingPortionsUnlockTime);
      expect(info.vestingPortionsUnlockTime.map((m) => m.toNumber())).have.all.members(vestingPortionsUnlockTime);

      expect(info[1].map((m) => m.toNumber())).have.all.members(vestingPercentPerPortion);
      expect(info.vestingPercentPerPortion.map((m) => m.toNumber())).have.all.members(vestingPercentPerPortion);

      expect(info[2]).equals(vestingPercentPrecision);
      expect(info.vestingPercentPrecision).equals(vestingPercentPrecision);
    });

    it("set vesting info fail", async () => {
      await expect(vestingVaultMeta.setVestingInfo([], [], 0)).revertedWith("wrong precision");
      await expect(vestingVaultMeta.setVestingInfo([], [1], 1)).revertedWith("wrong array length");

      await expect(vestingVaultMeta.setVestingInfo([0, 1, 2, 2], [1, 1, 1, 1], 1)).revertedWith("Unlock time must be greater than previous.");
      await expect(vestingVaultMeta.setVestingInfo([0, 1, 2, 3], [1, 1, 1, 1], 3)).revertedWith("Percent distribution issue.");
    });
  });

  describe("Update status", () => {
    describe("Update state to beneficiary", () => {
      it("success changed status", async () => {
        const karmaToken = await ethers
          .getContractFactory("KarmaToken")
          .then((factory) => factory.deploy())
          .then((type) => type.deployed());

        await vestingVaultMeta.setToken(karmaToken.address);
        await vestingVaultMeta.setZeroDate(Time().hours(10).toNumber());
        await vestingVaultMeta.setVestingInfo([0, 1, 2], [30, 30, 40], 100);

        await expect(vestingVaultMeta.changeStatus(1)).emit(vestingVaultMeta, "VaultStatusUpdated").withArgs(1, 0);
        expect(await vestingVaultMeta.getStatus()).equals(1);
        expect(await vestingVaultMeta.changeStatusToBeneficiaryCalled()).equals(true);
      });
      it("fail changed status", async () => {
        await expect(vestingVaultMeta.changeStatus(0)).revertedWith("wrong status stage");
        await expect(vestingVaultMeta.changeStatus(1)).revertedWith("address is empty");
        await expect(vestingVaultMeta.changeStatus(2)).revertedWith("wrong status stage");
      });
    });

    describe("Update state to claim", () => {
      it("success changed status", async () => {
        const karmaToken = await ethers
          .getContractFactory("KarmaToken")
          .then((factory) => factory.deploy())
          .then((type) => type.deployed());

        await vestingVaultMeta.setToken(karmaToken.address);
        await vestingVaultMeta.setZeroDate(Time().hours(10).toNumber());
        await vestingVaultMeta.setVestingInfo([0, 1, 2], [30, 30, 40], 100);
        await vestingVaultMeta.changeStatus(1);
        await vestingVaultMeta.changeStatus(2);

        expect(await vestingVaultMeta.getStatus()).equals(2);
        expect(await vestingVaultMeta.changeStatusToClaimCalled()).equals(true);
      });
    });
  });
});
