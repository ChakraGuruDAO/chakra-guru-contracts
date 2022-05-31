import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import * as Contracts from "~/typechain";

describe("ChakraToken", function () {
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
});
