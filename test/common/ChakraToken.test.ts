import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import * as Contracts from "~/typechain";
import { resetNetwork } from "../_base";

describe("ChakraToken", function () {
  let ChakraToken: Contracts.ChakraToken__factory;
  let chakraToken: Contracts.ChakraToken;
  let [deployer, alice, bob, karl]: SignerWithAddress[] = [];

  before(async () => {
    [deployer, alice, bob, karl] = await ethers.getSigners();
    ChakraToken = await ethers.getContractFactory("ChakraToken");
  });

  beforeEach(async () => {
    await resetNetwork(ethers);

    chakraToken = await ChakraToken.deploy();
    await chakraToken.deployed();
  });

  describe("deployment", () => {
    it("should assign the total supply of tokens to deployer", async () => {
      const deployerBalance = await chakraToken.balanceOf(deployer.address);
      expect(await chakraToken.totalSupply()).equals(deployerBalance);
    });
  });

  describe("Transaction", () => {
    it("should transfer tokens between accounts", async () => {
      await chakraToken.connect(deployer).transfer(alice.address, 1000);
      expect(await chakraToken.balanceOf(alice.address)).equals(1000);

      await chakraToken.connect(alice).transfer(bob.address, 500);
      expect(await chakraToken.balanceOf(alice.address)).equals(500);
      expect(await chakraToken.balanceOf(bob.address)).equals(500);
    });

    it("should fail if sender doesnt have enough tokens", async () => {
      const initialBalance = await chakraToken.balanceOf(deployer.address);

      await expect(chakraToken.connect(alice).transfer(deployer.address, 10)).revertedWith("ERC20: transfer amount exceeds balance");
      expect(await chakraToken.balanceOf(deployer.address)).equals(initialBalance);
    });

    it("should update balances after transfers", async () => {
      const initialBalance = await chakraToken.balanceOf(deployer.address);

      await chakraToken.transfer(alice.address, 100);
      await chakraToken.transfer(bob.address, 200);

      expect(await chakraToken.balanceOf(deployer.address)).equals(initialBalance.sub(300));
      expect(await chakraToken.balanceOf(alice.address)).equals(100);
      expect(await chakraToken.balanceOf(bob.address)).equals(200);
    });
  });
});
