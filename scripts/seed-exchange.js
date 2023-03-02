const config = require("../config.json");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const wait = (seconds) => {
  const milliseconds = seconds * 1000;
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

async function main() {
  // Fetch accounts from wallet - these are unlocked
  const accounts = await ethers.getSigners();

  // Fetch  network
  const { chainId } = await ethers.provider.getNetwork();
  console.log("Using chainId:", chainId);

  // Fetch deployed tokens
  const ZoboToken = await ethers.getContractAt(
    "ZoboToken",
    config[chainId].ZoboToken.address
  );
  console.log(`ZoboToken Token fetched: ${ZoboToken.address}\n`);

  const SiToken = await ethers.getContractAt(
    "ZoboToken",
    config[chainId].SiToken.address
  );
  console.log(`SiToken Token fetched: ${SiToken.address}\n`);

  const SuToken = await ethers.getContractAt(
    "ZoboToken",
    config[chainId].SuToken.address
  );
  console.log(`SuToken Token fetched: ${SuToken.address}\n`);

  // Fetch the deployed exchange
  const exchange = await ethers.getContractAt(
    "ZoboExchange",
    config[chainId].exchange.address
  );
  console.log(`Zobo Exchange fetched: ${exchange.address}\n`);

  //   Give tokens to accounts[1]
  const sender = accounts[0];
  const receiver = accounts[1];
  let amount = tokens(10000);

  // user1 transfer 10,000 SiToken
  let transaction, result;
  transaction = await SiToken.connect(sender).transfer(
    receiver.address,
    amount
  );

  console.log(
    `Transferred ${amount} tokens from ${sender.address} to ${receiver.address}\n`
  );

  //   Set up exchange users
  const user1 = accounts[0];
  const user2 = accounts[1];
  amount = tokens(10000);

  //   user1 approves 10,000 ZoboToken
  transaction = await ZoboToken.connect(user1).approve(
    exchange.address,
    amount
  );
  await transaction.wait();
  console.log(`Approved ${amount} tokens from ${user1.address}`);

  // user1 deposits 10,000 ZoboToken
  transaction = await exchange
    .connect(user1)
    .depositToken(ZoboToken.address, amount);
  await transaction.wait();
  console.log(`Deposited ${amount} Ether from ${user1.address}\n`);

  //   user2 approves 10,000 SiToken
  transaction = await SiToken.connect(user2).approve(exchange.address, amount);
  console.log(`Approved ${amount} tokens from ${user2.address}`);
  await transaction.wait();

  // user2 deposits 10,000 SiToken
  transaction = await exchange
    .connect(user2)
    .depositToken(SiToken.address, amount);
  await transaction.wait();
  console.log(`Deposited ${amount} Ether from ${user2.address}\n`);

  /***********************Seed a Cancelled Order************************/
  // User 1 makes order to get tokens
  let orderId;
  transaction = await exchange
    .connect(user1)
    .makeOrder(SiToken.address, tokens(100), ZoboToken.address, tokens(5));
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}`);

  // User 1 cancels order
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user1).cancelOrder(orderId);
  result = await transaction.wait();
  console.log(`Cancelled order from ${user1.address}\n`);

  // Wait 1 second
  await wait(1);

  /************************Seed Filled Orders***************************/
  // user 1 makes order
  transaction = await exchange
    .connect(user1)
    .makeOrder(SiToken.address, tokens(100), ZoboToken.address, tokens(10));
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}`);

  // user 2 fills order
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = await transaction.wait();
  console.log(`Filled order from ${user1.address}\n`);

  // Wait 1 second
  await wait(1);

  // user 1 makes another order
  transaction = await exchange
    .connect(user1)
    .makeOrder(SiToken.address, tokens(50), ZoboToken.address, tokens(15));
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}`);

  // user 2 fills another order
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = await transaction.wait();
  console.log(`Filled order from ${user1.address}\n`);

  // Wait 1 second
  await wait(1);

  // user 1 makes final order
  transaction = await exchange
    .connect(user1)
    .makeOrder(SiToken.address, tokens(200), ZoboToken.address, tokens(25));
  result = await transaction.wait();
  console.log(`Made order from ${user1.address}`);

  // user 2 fills final order
  orderId = result.events[0].args.id;
  transaction = await exchange.connect(user2).fillOrder(orderId);
  result = await transaction.wait();
  console.log(`Filled order from ${user1.address}\n`);

  // Wait 1 second
  await wait(1);

  /**************************Seed Open Orders**************************/
  // User 1 makes 10 orders
  for (let i = 1; i <= 10; i++) {
    transaction = await exchange
      .connect(user1)
      .makeOrder(
        SiToken.address,
        tokens(10 * i),
        ZoboToken.address,
        tokens(10)
      );
    result = await transaction.wait();

    console.log(`Made order from ${user1.address}`);

    // Wait 1 second
    await wait(1);
  }

  console.log("\n");

  // User 2 makes 10 orders
  for (let i = 1; i <= 10; i++) {
    transaction = await exchange
      .connect(user2)
      .makeOrder(
        ZoboToken.address,
        tokens(10),
        SiToken.address,
        tokens(10 * i)
      );
    result = await transaction.wait();

    console.log(`Made order from ${user2.address}`);

    // Wait 1 second
    await wait(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
