import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import * as Contracts from "~/typechain";

describe("KarmaToken", function () {
  let KarmaToken: Contracts.KarmaToken__factory;
  let karmaToken: Contracts.KarmaToken;
  let deployer: SignerWithAddress;

  before(async () => {
    [deployer] = await ethers.getSigners();
    KarmaToken = await ethers.getContractFactory("KarmaToken");
  });
  beforeEach(async () => {
    karmaToken = await KarmaToken.deploy();
    await karmaToken.deployed();
  });

  it("test", async function () {});
});
