import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import { emptyAddress, resetNetwork } from "~/test/_base";
import * as Contracts from "~/typechain";

describe("CrowdsaleLimitter", function () {
  let CrowdsaleMeta: Contracts.CrowdsaleMetaMock__factory;
  let crowdsaleMeta: Contracts.CrowdsaleMetaMock;
  let [deployer, alice, bob]: SignerWithAddress[] = [];

  before(async () => {
    [deployer, alice, bob] = await ethers.getSigners();
    CrowdsaleMeta = await ethers.getContractFactory("CrowdsaleMetaMock");
  });

  beforeEach(async () => {
    await resetNetwork(ethers);

    crowdsaleMeta = await CrowdsaleMeta.connect(deployer).deploy();
    await crowdsaleMeta.deployed();
  });
});
