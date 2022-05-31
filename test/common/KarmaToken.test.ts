import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import * as Contracts from "~/typechain";

describe("KarmaToken", function () {
  let KarmaToken: Contracts.KarmaToken__factory;
  let karmaToken: Contracts.KarmaToken;
  let deployer: SignerWithAddress;
  let addr1: SignerWithAddress, addr2: SignerWithAddress;

  before(async () => {
    [deployer, addr1, addr2] = await ethers.getSigners();
    KarmaToken = await ethers.getContractFactory("KarmaToken");
  });

  beforeEach(async () => {
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
      await karmaToken.connect(deployer).transfer(addr1.address, 1000);
      expect(await karmaToken.balanceOf(addr1.address)).equals(1000);

      await karmaToken.connect(addr1).transfer(addr2.address, 500);
      expect(await karmaToken.balanceOf(addr1.address)).equals(500);
      expect(await karmaToken.balanceOf(addr2.address)).equals(500);
    });

    it("should fail if sender doesnt have enough tokens", async () => {
      const initialBalance = await karmaToken.balanceOf(deployer.address);

      await expect(karmaToken.connect(addr1).transfer(deployer.address, 10)).revertedWith("ERC20: transfer amount exceeds balance");
      expect(await karmaToken.balanceOf(deployer.address)).equals(initialBalance);
    });

    it("should update balances after transfers", async () => {
      const initialBalance = await karmaToken.balanceOf(deployer.address);

      await karmaToken.transfer(addr1.address, 100);
      await karmaToken.transfer(addr2.address, 200);

      expect(await karmaToken.balanceOf(deployer.address)).equals(initialBalance.sub(300));
      expect(await karmaToken.balanceOf(addr1.address)).equals(100);
      expect(await karmaToken.balanceOf(addr2.address)).equals(200);
    });
  });
});
