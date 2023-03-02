const { ethers } = require("hardhat");

const main = async () => {
  console.log(`Preparing deployment...\n`);

  // Get contracts
  const ZoboToken = await ethers.getContractFactory("ZoboToken");
  const ZoboExchange = await ethers.getContractFactory("ZoboExchange");

  // Fetch accounts
  const accounts = await ethers.getSigners();

  console.log(
    `Accounts fetched:\n${accounts[0].address}\n${accounts[1].address}\n`
  );

  // Deploy contracts
  const zoboToken = await ZoboToken.deploy("ZoboToken", "ZBT", 18, "1000000");
  await zoboToken.deployed();

  console.log(`ZoboToken Deployed to: ${zoboToken.address}`);

  const siToken = await ZoboToken.deploy("SiToken", "SiT", 18, "1000000");
  await siToken.deployed();
  console.log(`SiToken Deployed to: ${siToken.address}`);

  const suToken = await ZoboToken.deploy("SuToken", "SuT", 18, "1000000");
  await suToken.deployed();
  console.log(`SuToken Deployed to: ${suToken.address}`);

  const zoboExchange = await ZoboExchange.deploy(accounts[1].address, 10);
  await zoboExchange.deployed();
  console.log(`Exchange Deployed to: ${zoboExchange.address}`);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

runMain();
