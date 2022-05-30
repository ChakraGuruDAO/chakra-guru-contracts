import { expect } from "chai";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import * as Contracts from "../typechain";

describe("Box", function () {
  let Box: Contracts.Box__factory;
  let box: Contracts.Box;

  before(async () => {
    Box = await ethers.getContractFactory("Box");
  });
  beforeEach(async () => {
    box = await Box.deploy();
    await box.deployed();
  });

  it("retrieve returns a value previously stored", async function () {
    // Store a value
    const value = 42;
    await box.setValue(value);

    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    expect((await box.getValue()).toString()).to.equal(value.toString());
  });
});
