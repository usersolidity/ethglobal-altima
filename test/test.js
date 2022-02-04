const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Altima", function () {
  it("Should return the new greeting once it's changed", async function () {
    const altimaContract = await ethers.getContractFactory("Altima");
    const greeter = await altimaContract.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
