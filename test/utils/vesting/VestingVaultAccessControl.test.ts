import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Signer } from "ethers";
import { ethers, waffle } from "hardhat";
import { Duration, resetNetwork, Time } from "~/test/_base";
import * as Contracts from "~/typechain";

describe("VestingVaultAccessControl", function () {
  let VestingVaultAccessControl: Contracts.VestingVaultAccessControlMock__factory;
  let vestingVaultAccessControl: Contracts.VestingVaultAccessControlMock;
  let [deployer, alice, bob, karl]: SignerWithAddress[] = [];

  async function deployKarma() {
    return ethers
      .getContractFactory("KarmaToken")
      .then((factory) => factory.deploy())
      .then((type) => type.deployed());
  }

  async function getConfigInfo() {
    const zeroDate = Time().hours(10).toNumber();
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

  before(async () => {
    [deployer, alice, bob, karl] = await ethers.getSigners();
    VestingVaultAccessControl = await ethers.getContractFactory("VestingVaultAccessControlMock");
  });
  beforeEach(async () => {
    await resetNetwork(ethers);

    vestingVaultAccessControl = await VestingVaultAccessControl.deploy();
    await vestingVaultAccessControl.deployed();
  });

  describe("Check access control", () => {
    it("check role is granted for deployer", async () => {
      expect(await vestingVaultAccessControl.hasRole(await vestingVaultAccessControl.DEFAULT_ADMIN_ROLE(), deployer.address)).equals(true);
      expect(await vestingVaultAccessControl.hasRole(await vestingVaultAccessControl.CONFIG_ROLE(), deployer.address)).equals(true);
      expect(await vestingVaultAccessControl.hasRole(await vestingVaultAccessControl.BENEFICIARY_MANAGE_ROLE(), deployer.address)).equals(false);

      expect(await vestingVaultAccessControl.hasRole(await vestingVaultAccessControl.DEFAULT_ADMIN_ROLE(), alice.address)).equals(false);
      expect(await vestingVaultAccessControl.hasRole(await vestingVaultAccessControl.CONFIG_ROLE(), alice.address)).equals(false);
      expect(await vestingVaultAccessControl.hasRole(await vestingVaultAccessControl.BENEFICIARY_MANAGE_ROLE(), alice.address)).equals(false);
    });

    it("check grant role for other", async () => {
      await vestingVaultAccessControl.grantRole(await vestingVaultAccessControl.CONFIG_ROLE(), alice.address);

      expect(await vestingVaultAccessControl.hasRole(await vestingVaultAccessControl.DEFAULT_ADMIN_ROLE(), alice.address)).equals(false);
      expect(await vestingVaultAccessControl.hasRole(await vestingVaultAccessControl.CONFIG_ROLE(), alice.address)).equals(true);
      expect(await vestingVaultAccessControl.hasRole(await vestingVaultAccessControl.BENEFICIARY_MANAGE_ROLE(), alice.address)).equals(false);

      await vestingVaultAccessControl.grantRole(await vestingVaultAccessControl.BENEFICIARY_MANAGE_ROLE(), bob.address);
      expect(await vestingVaultAccessControl.hasRole(await vestingVaultAccessControl.DEFAULT_ADMIN_ROLE(), bob.address)).equals(false);
      expect(await vestingVaultAccessControl.hasRole(await vestingVaultAccessControl.CONFIG_ROLE(), bob.address)).equals(false);
      expect(await vestingVaultAccessControl.hasRole(await vestingVaultAccessControl.BENEFICIARY_MANAGE_ROLE(), bob.address)).equals(true);
    });

    it("check role access for CONFIG_ROLE", async () => {
      const karmaToken = await deployKarma();
      const { zeroDate, vestingPercentPerPortion, vestingPercentPrecision, vestingPortionsUnlockTime } = await getConfigInfo();
      await expect(vestingVaultAccessControl.connect(alice).setInfo(karmaToken.address, zeroDate, vestingPortionsUnlockTime, vestingPercentPerPortion, vestingPercentPrecision)).revertedWith(
        `AccessControl: account ${alice.address.toLowerCase()} is missing role ${await vestingVaultAccessControl.CONFIG_ROLE()}`
      );
      await expect(vestingVaultAccessControl.connect(bob).changeStatus(1)).revertedWith(
        `AccessControl: account ${bob.address.toLowerCase()} is missing role ${await vestingVaultAccessControl.CONFIG_ROLE()}`
      );
    });

    it("check role access for BENEFICIARY_ROLE", async () => {
      await vestingVaultAccessControl.grantRole(await vestingVaultAccessControl.CONFIG_ROLE(), alice.address);
      await vestingVaultAccessControl.grantRole(await vestingVaultAccessControl.BENEFICIARY_MANAGE_ROLE(), bob.address);

      const karmaToken = await deployKarma();
      const { zeroDate, vestingPercentPerPortion, vestingPercentPrecision, vestingPortionsUnlockTime } = await getConfigInfo();
      await vestingVaultAccessControl.connect(alice).setInfo(karmaToken.address, zeroDate, vestingPortionsUnlockTime, vestingPercentPerPortion, vestingPercentPrecision);
      await vestingVaultAccessControl.connect(alice).changeStatus(1);

      await expect(vestingVaultAccessControl.connect(alice).addBeneficiary(karl.address, 100)).revertedWith(
        `AccessControl: account ${alice.address.toLowerCase()} is missing role ${await vestingVaultAccessControl.BENEFICIARY_MANAGE_ROLE()}`
      );

      await vestingVaultAccessControl.connect(bob).addBeneficiary(karl.address, 100);
    });
  });
});
