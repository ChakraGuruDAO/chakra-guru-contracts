import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import * as Contracts from "~/typechain";
import { resetNetwork } from "../_base";

describe("KarmaToken", function () {
  let KarmaToken: Contracts.KarmaToken__factory;
  let karmaToken: Contracts.KarmaToken;
  let [deployer, alice, bob, karl]: SignerWithAddress[] = [];

  before(async () => {
    [deployer, alice, bob, karl] = await ethers.getSigners();
    KarmaToken = await ethers.getContractFactory("KarmaToken");
  });

  beforeEach(async () => {
    await resetNetwork(ethers);

    karmaToken = await KarmaToken.deploy();
    await karmaToken.deployed();
  });

  describe("deployment", () => {
    it("should assign the total supply of tokens to deployer", async () => {
      const deployerBalance = await karmaToken.balanceOf(deployer.address);
      expect(await karmaToken.totalSupply()).equals(deployerBalance);
    });
  });

  describe("Transaction", () => {
    it("should transfer tokens between accounts", async () => {
      await karmaToken.connect(deployer).transfer(alice.address, 1000);
      expect(await karmaToken.balanceOf(alice.address)).equals(1000);

      await karmaToken.connect(alice).transfer(bob.address, 500);
      expect(await karmaToken.balanceOf(alice.address)).equals(500);
      expect(await karmaToken.balanceOf(bob.address)).equals(500);
    });

    it("should fail if sender doesnt have enough tokens", async () => {
      const initialBalance = await karmaToken.balanceOf(deployer.address);

      await expect(karmaToken.connect(alice).transfer(deployer.address, 10)).revertedWith("ERC20: transfer amount exceeds balance");
      expect(await karmaToken.balanceOf(deployer.address)).equals(initialBalance);
    });

    it("should update balances after transfers", async () => {
      const initialBalance = await karmaToken.balanceOf(deployer.address);

      await karmaToken.transfer(alice.address, 100);
      await karmaToken.transfer(bob.address, 200);

      expect(await karmaToken.balanceOf(deployer.address)).equals(initialBalance.sub(300));
      expect(await karmaToken.balanceOf(alice.address)).equals(100);
      expect(await karmaToken.balanceOf(bob.address)).equals(200);
    });
  });
});
