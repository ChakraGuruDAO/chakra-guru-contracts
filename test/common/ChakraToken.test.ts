import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import * as Contracts from "~/typechain";

describe("ChakraToken", function () {
  let ChakraToken: Contracts.ChakraToken__factory;
  let chakraToken: Contracts.ChakraToken;
  let deployer: SignerWithAddress;
  let addr1: SignerWithAddress, addr2: SignerWithAddress;

  before(async () => {
    [deployer, addr1, addr2] = await ethers.getSigners();
    ChakraToken = await ethers.getContractFactory("ChakraToken");
  });

  beforeEach(async () => {
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
      await chakraToken.connect(deployer).transfer(addr1.address, 1000);
      expect(await chakraToken.balanceOf(addr1.address)).equals(1000);

      await chakraToken.connect(addr1).transfer(addr2.address, 500);
      expect(await chakraToken.balanceOf(addr1.address)).equals(500);
      expect(await chakraToken.balanceOf(addr2.address)).equals(500);
    });

    it("should fail if sender doesnt have enough tokens", async () => {
      const initialBalance = await chakraToken.balanceOf(deployer.address);

      await expect(chakraToken.connect(addr1).transfer(deployer.address, 10)).revertedWith("ERC20: transfer amount exceeds balance");
      expect(await chakraToken.balanceOf(deployer.address)).equals(initialBalance);
    });

    it("should update balances after transfers", async () => {
      const initialBalance = await chakraToken.balanceOf(deployer.address);

      await chakraToken.transfer(addr1.address, 100);
      await chakraToken.transfer(addr2.address, 200);

      expect(await chakraToken.balanceOf(deployer.address)).equals(initialBalance.sub(300));
      expect(await chakraToken.balanceOf(addr1.address)).equals(100);
      expect(await chakraToken.balanceOf(addr2.address)).equals(200);
    });
  });
});
