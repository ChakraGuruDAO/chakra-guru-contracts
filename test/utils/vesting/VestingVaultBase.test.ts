import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { Duration, emptyAddress, resetNetwork, setNextBlockTimestamp, Time } from "~/test/_base";
import * as Contracts from "~/typechain";

describe("KarmaToken", function () {
  let VestingVaultBase: Contracts.VestingVaultBaseMock__factory;
  let vestingVaultBase: Contracts.VestingVaultBaseMock;
  let [deployer, alice, bob]: SignerWithAddress[] = [];

  async function changeStatusToBeneficiary() {
    const karmaToken = await ethers
      .getContractFactory("KarmaToken")
      .then((factory) => factory.deploy())
      .then((type) => type.deployed());

    const zeroDate = Time().hours(10).toNumber();
    const vestingPortionsUnlockTime = [Duration().toNumber(), Duration().hours(1).toNumber(), Duration().hours(2).toNumber(), Duration().hours(3).toNumber()];
    const vestingPercentPerPortion = [10000, 0, 45000, 45000];
    const vestingPercentPrecision = 100000;

    await vestingVaultBase.setInfo(karmaToken.address, zeroDate, vestingPortionsUnlockTime, vestingPercentPerPortion, vestingPercentPrecision);
    await vestingVaultBase.changeStatus(1);

    return {
      karmaToken,
      zeroDate,
      vestingPortionsUnlockTime,
      vestingPercentPerPortion,
      vestingPercentPrecision,
    };
  }

  async function changeStatusToClaim(karmaToken: Contracts.KarmaToken) {
    const beneficiaries: [string, number][] = [
      [alice.address, 100],
      [bob.address, 200],
    ];
    for (const [address, amount] of beneficiaries) {
      await vestingVaultBase.addBeneficiary(address, amount);
    }

    const allBalance = await vestingVaultBase.getAllBalance();
    await karmaToken.transfer(vestingVaultBase.address, allBalance);
    await vestingVaultBase.changeStatus(2);

    return { beneficiaries, allBalance };
  }

  before(async () => {
    [deployer, alice, bob] = await ethers.getSigners();
    VestingVaultBase = await ethers.getContractFactory("VestingVaultBaseMock");
  });
  beforeEach(async () => {
    await resetNetwork(ethers);

    vestingVaultBase = await VestingVaultBase.deploy();
    await vestingVaultBase.deployed();
  });

  describe("Check beneficiary", () => {
    it("add beneficiary failed", async () => {
      await expect(vestingVaultBase.addBeneficiary(emptyAddress(), 0)).revertedWith("wrong status");

      await changeStatusToBeneficiary();

      await expect(vestingVaultBase.addBeneficiary(emptyAddress(), 0)).revertedWith("empty address");
      await expect(vestingVaultBase.addBeneficiary(alice.address, 0)).revertedWith("empty amount");
    });

    it("add beneficiary success", async () => {
      const { vestingPercentPerPortion } = await changeStatusToBeneficiary();
      await expect(vestingVaultBase.addBeneficiary(alice.address, 100)).emit(vestingVaultBase, "VaultBeneficiaryUpdated").withArgs(alice.address, 100);

      let beneficiary = await vestingVaultBase.getBeneficiary(alice.address);

      expect(beneficiary[0]).equals(100);
      expect(beneficiary.amount).equals(100);

      expect(beneficiary[1]).deep.equals(new Array(vestingPercentPerPortion.length).fill(false));
      expect(beneficiary.isPortionWithdraw).deep.equals(new Array(vestingPercentPerPortion.length).fill(false));

      await expect(vestingVaultBase.addBeneficiary(alice.address, 200)).emit(vestingVaultBase, "VaultBeneficiaryUpdated").withArgs(alice.address, 300);

      beneficiary = await vestingVaultBase.getBeneficiary(alice.address);

      expect(beneficiary[0]).equals(300);
      expect(beneficiary.amount).equals(300);

      expect(beneficiary[1]).deep.equals(new Array(vestingPercentPerPortion.length).fill(false));
      expect(beneficiary.isPortionWithdraw).deep.equals(new Array(vestingPercentPerPortion.length).fill(false));
    });

    it("remove beneficiary failed", async () => {
      await expect(vestingVaultBase.removeBeneficiary(emptyAddress())).revertedWith("wrong status");

      await changeStatusToBeneficiary();

      await expect(vestingVaultBase.removeBeneficiary(alice.address)).revertedWith("beneficiary not found");
    });

    it("remove beneficiary success", async () => {
      await changeStatusToBeneficiary();
      await vestingVaultBase.addBeneficiary(alice.address, 100);
      await vestingVaultBase.addBeneficiary(bob.address, 200);

      await expect(vestingVaultBase.removeBeneficiary(alice.address)).emit(vestingVaultBase, "VaultBeneficiaryUpdated").withArgs(alice.address, 0);

      const aliceBeneficiary = await vestingVaultBase.getBeneficiary(alice.address);
      expect(aliceBeneficiary.amount).equals(0);

      await expect(vestingVaultBase.removeBeneficiary(alice.address)).revertedWith("beneficiary not found");

      expect(await vestingVaultBase.getAllBalance()).equals(200);

      await expect(vestingVaultBase.removeBeneficiary(bob.address)).emit(vestingVaultBase, "VaultBeneficiaryUpdated").withArgs(bob.address, 0);

      const bobBeneficiary = await vestingVaultBase.getBeneficiary(bob.address);
      expect(bobBeneficiary.amount).equals(0);

      expect(await vestingVaultBase.getAllBalance()).equals(0);
    });

    it("check getters", async () => {
      expect(await vestingVaultBase.getAllBalance()).equals(0);
      expect(await vestingVaultBase.getBeneficiary(alice.address).then((data) => data.amount)).equals(0);
      expect(await vestingVaultBase.getBeneficiary(bob.address).then((data) => data.amount)).equals(0);
      expect(await vestingVaultBase.getAllBeneficiaries()).deep.equals([]);

      await changeStatusToBeneficiary();

      expect(await vestingVaultBase.getAllBalance()).equals(0);
      expect(await vestingVaultBase.getBeneficiary(alice.address).then((data) => data.amount)).equals(0);
      expect(await vestingVaultBase.getBeneficiary(bob.address).then((data) => data.amount)).equals(0);
      expect(await vestingVaultBase.getAllBeneficiaries()).deep.equals([]);

      await vestingVaultBase.addBeneficiary(alice.address, 100);
      await vestingVaultBase.addBeneficiary(bob.address, 200);

      expect(await vestingVaultBase.getAllBalance()).equals(300);
      expect(await vestingVaultBase.getBeneficiary(alice.address).then((data) => data.amount)).equals(100);
      expect(await vestingVaultBase.getBeneficiary(bob.address).then((data) => data.amount)).equals(200);
      expect(await vestingVaultBase.getAllBeneficiaries()).deep.equals([alice.address, bob.address]);

      await vestingVaultBase.removeBeneficiary(bob.address);

      expect(await vestingVaultBase.getAllBalance()).equals(100);
      expect(await vestingVaultBase.getBeneficiary(alice.address).then((data) => data.amount)).equals(100);
      expect(await vestingVaultBase.getBeneficiary(bob.address).then((data) => data.amount)).equals(0);
      expect(await vestingVaultBase.getAllBeneficiaries()).deep.equals([alice.address]);

      await vestingVaultBase.addBeneficiary(alice.address, 900);

      expect(await vestingVaultBase.getAllBalance()).equals(1000);
      expect(await vestingVaultBase.getBeneficiary(alice.address).then((data) => data.amount)).equals(1000);
      expect(await vestingVaultBase.getBeneficiary(bob.address).then((data) => data.amount)).equals(0);
      expect(await vestingVaultBase.getAllBeneficiaries()).deep.equals([alice.address]);
    });
  });

  describe("Check claims", async () => {
    it("change status to claim failed", async () => {
      await changeStatusToBeneficiary();

      await vestingVaultBase.addBeneficiary(alice.address, 100);
      await vestingVaultBase.addBeneficiary(bob.address, 200);

      await expect(vestingVaultBase.changeStatus(2)).revertedWith("balance is not equals");
    });

    it("claim failed when status is not setted", async () => {
      await changeStatusToBeneficiary();

      await expect(vestingVaultBase.claimMultiPortions([0, 1, 2, 3])).revertedWith("wrong status");
    });

    it("change status to claim success", async () => {
      const { karmaToken } = await changeStatusToBeneficiary();

      await vestingVaultBase.addBeneficiary(alice.address, 100);
      await vestingVaultBase.addBeneficiary(bob.address, 200);

      const allBalance = await vestingVaultBase.getAllBalance();
      expect(allBalance).equals(300);

      await karmaToken.transfer(vestingVaultBase.address, allBalance);
      expect(await vestingVaultBase.getAllBalance()).equals(await karmaToken.balanceOf(vestingVaultBase.address));

      await vestingVaultBase.changeStatus(2);
      expect(await vestingVaultBase.getStatus()).equals(2);

      await expect(vestingVaultBase.addBeneficiary(alice.address, 100)).revertedWith("wrong status");
      await expect(vestingVaultBase.removeBeneficiary(alice.address)).revertedWith("wrong status");
    });

    it("claim beneficairy success", async () => {
      const { karmaToken, zeroDate, vestingPortionsUnlockTime, vestingPercentPerPortion, vestingPercentPrecision } = await changeStatusToBeneficiary();
      const {
        beneficiaries: [[aliceAddress, aliceAmount], [bobAddress, bobAmount]],
        allBalance,
      } = await changeStatusToClaim(karmaToken);

      await setNextBlockTimestamp(ethers, Time(zeroDate).seconds(vestingPortionsUnlockTime[0]).toNumber());

      await vestingVaultBase.connect(alice).claimMultiPortions([1, 2, 3]);
      expect(await vestingVaultBase.getBeneficiary(aliceAddress).then((data) => data.isPortionWithdraw)).deep.equals(new Array(vestingPercentPerPortion.length).fill(false));
      expect(await karmaToken.balanceOf(aliceAddress)).equals(0);

      await vestingVaultBase.connect(alice).claimMultiPortions([0, 1, 2]);
      expect(await vestingVaultBase.getBeneficiary(aliceAddress).then((data) => data.isPortionWithdraw)).deep.equals([true, ...new Array(vestingPercentPerPortion.length - 1).fill(false)]);
      expect(await karmaToken.balanceOf(aliceAddress)).equals((aliceAmount * vestingPercentPerPortion[0]) / vestingPercentPrecision);

      await vestingVaultBase.connect(alice).claimMultiPortions([0, 1, 2]);
      expect(await karmaToken.balanceOf(aliceAddress)).equals((aliceAmount * vestingPercentPerPortion[0]) / vestingPercentPrecision);

      expect(await vestingVaultBase.getBeneficiary(bobAddress).then((data) => data.isPortionWithdraw)).deep.equals(new Array(vestingPercentPerPortion.length).fill(false));
      await setNextBlockTimestamp(
        ethers,
        Time(zeroDate)
          .seconds(vestingPortionsUnlockTime[0] + vestingPortionsUnlockTime[1])
          .toNumber()
      );
      await vestingVaultBase.connect(bob).claimMultiPortions([0, 1, 2]);
      expect(await vestingVaultBase.getBeneficiary(bobAddress).then((data) => data.isPortionWithdraw)).deep.equals([true, true, ...new Array(vestingPercentPerPortion.length - 2).fill(false)]);
      expect(await karmaToken.balanceOf(bobAddress)).equals((bobAmount * (vestingPercentPerPortion[0] + vestingPercentPerPortion[1])) / vestingPercentPrecision);
    });
  });
});
