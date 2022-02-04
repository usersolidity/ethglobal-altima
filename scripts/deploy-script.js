const hre = require("hardhat");

async function main() {
  
  const altimaContract = await hre.ethers.getContractFactory("Altima");
  const altima = await altimaContract.deploy();

  await altima.deployed();

  console.log("Altima Contract deployed to:", altima.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
