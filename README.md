# Title

Zobo Decentralize Exchange App 

# Description

ZoboExchange is a decentralized exchange that operates on the Polygon blockchain, which is a layer 2 scaling solution for Ethereum. This means that transactions on Zobo Exchange are processed and settled on the Polygon blockchain, providing users with fast and low-cost trading experience. ZoboExchange offers a decentralized and trustless platform for users to trade cryptocurrencies, where they have full control over their funds. ZoboToken is the native token of ZoboExchange and is used as a means of payment for trading fees.

# Snapshot

![ZoboExchange](/screenshots/zobo.gif)

# Link

ZoboExchnage is a decentralized exchange (DEX) built on the polygon blockchain. It allows for the buying and selling of various cryptocurrencies.

Github Link: https://github.com/The-FutureX/zoboswap

Production Link: https://zoboexchange.vercel.app/

# Authors

Abiye Chris. I. Surulere
Github Link: https://github.com/suruabiye

Oluwatimilehin Bello
Github Link: https://github.com/Timilehin-bello

Toluwani Olugbesan
Github Link: https://github.com/Tolu1

Ruth Ogban
Github Link: https://github.com/RuthO1

Kingsley Onoh
Github Link: https://github.com/KingsleyOnoh38

# Stacks

HTML,CSS, Tailwind, Next.js and Solidity.

# Inspiration/Muse:

We were inspired by Dapp University. <br/>

# How to Install and Run the Project

**Clone the repository**

```javascript
git clone https://github.com/The-FutureX/zoboswap.git
```

**cd into the Project Folder**

```bash
cd zoboswap
```

**Delete package-lock.json**

```javascript
rm package-lock.json
```

**Install the dependencies**

```javascript
npm install
```

**Start Hardhat node**

```javascript
npx hardhat node
```

**Run the deploy Script**

```javascript
npx hardhat run --network localhost ./scripts/deploy.js
```

**!!IMPORTANT: Run the Seed Script to have the seed data on the exchange app**

```javascript
npx hardhat run --network localhost ./scripts/seed-exchange.js
```

**Start the development server**

```javascript
npm run dev
```

**!!IMPORTANT: Ensure you're using the `Mumbai Test Network`, you can also use `localhost` on your `metamask wallet` or any other wallet when connecting. Setup Details below**

**Port to Run the Website**

```
http://localhost:3000
```

### In order to interact with Zobo Exchange LOCALLY you must add these two fake accounts provided by hardhat to your metamask

- Account #1: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

  Private Key:`ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`,

- Account #2: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`,

  Private Key:`59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`

### In order to interact with Zobo Exchange Using Mumbai you must add these two accounts provided by my admin

- Account #1: `0xCC25B243088E302C5dEcb60D98f1Ed9A3b4ef53a`

  Private Key:`581d24bcb73d19019d78cd8bddbc89c362eb1dc22da667c0e9e0f07ae7af8284`,

- Account #2: `0xb5659fACf10dC21D5A90fa400e0D8b6C21F7F376`,

  Private Key:`aed11ff7984e7c5b48004e5c675e0e98c72094b480345e6c9a53565b2319f656`

## Metamask Setup

- Here is how to setup your testnets

### Polygon Mumbai Network Setup

1. Open metamask and add network.
2. Network name `Polygon Mumbai Testnet`
3. New RPC URL `https://polygon-mumbai.g.alchemy.com/v2/KBuX4MEvHnuxz1qVl9Rd-QKqEl0WUVWW`
4. Chain ID `80001`
5. Currency symbol `MATIC`

### Localhost Network Setup

1. Open metamask and add network.
2. Network name `Localhost`
3. New RPC URL `http://127.0.0.1:8545`
4. Chain ID `31337`
5. Currency symbol `ETH`

# Token Contract

The ZoboToken token smart contract was deployed at:

https://mumbai.polygonscan.com/address/0xe6415a44B6a0B8789e1c305CD60Ddd7c73a5d855

contract address:

```
0xe6415a44B6a0B8789e1c305CD60Ddd7c73a5d855
```

On the `MUMBAI TESTNET`.

<br>

The SiToken token smart contract was deployed at:

https://mumbai.polygonscan.com/address/0x486C63181b5195818bcAEb08951f9Fe45Fc931dB

contract address:

```
0x486C63181b5195818bcAEb08951f9Fe45Fc931dB
```

On the `MUMBAI TESTNET`.

<br>

The SuToken token smart contract was deployed at:

https://mumbai.polygonscan.com/address/0xcaA28CF23d874C84eb741Adb800Ed8bfB62DC5D4

contract address:

```
0xcaA28CF23d874C84eb741Adb800Ed8bfB62DC5D4
```

On the `MUMBAI TESTNET`.

## Mapping

`balanceOf`: This mapping stores all tokens values in different addresses using their address as the key.

`allowance`: This mapping stores all allowances for each address using their address as the key.

## Variables

`name`: Stores the name of the token

`symbol`: Stores the symbol or ticker of the token

`decimals`: This variable stores the decimals for the token.

`totalSupply`: This variable stores the total number of tokens that will ever be in supply.

## Functions

`transfer`: Sends an amount of token to an address.

`approve`: Approves an allowance amount that can be spent on behalf.

`transferFrom`: Sends an amount of token from one address to another address.

## Events

`Transfer`: it stores the transfer information passed in transaction logs when emitted.
`Approval`: it stores the approval information passed in transaction logs when emitted.

# Exchange Contract

The smart contract was deployed at:

https://mumbai.polygonscan.com/address/0x049aEFD7416a4808DA0A040FeD3399D1c4A86ABE

contract address:

```
0x049aEFD7416a4808DA0A040FeD3399D1c4A86ABE
```

On the `MUMBAI TESTNET`.

## Structs

`_Order`: This stores information about the orders, including the id, user, tokenGet, amountGet, tokenGive, amountGive and timestamp.

## Mapping

`tokens`: This mapping stores all tokens values in different addresses using their address as the key.

`orders`: This mapping stores all the orders using their orderId as the key.

`orderCancelled`: This mapping stores all the cancelled orders using their orderId as the key.

`orderFilled`: This mapping stores all the filled orders using their orderId as the key.

## Variables

`ownerFeeAccount`: Stores the address where service fee is paid

`pricePercent`: Stores the fee percentage

`orderCount`: This variable stores the number of orders.

## Functions

`depositToken`: Deposits token into liquidity pool.

`withdrawToken`: Withdraws token into liquidity pool.

`balanceOf`: Check Balances of an address.

`makeOrder`: Creates a new order.

`cancelOrder`: Cancels existing orders.

`fillOrder`: Fills orders and Charge Fees.

## Events

`Deposit`: it stores the deposit information passed in transaction logs when emitted.
`Withdraw`: it stores the withdraw information passed in transaction logs when emitted.
`Order`: it stores the order information passed in transaction logs when emitted.
`Cancel`: it stores the information of canceled order in transaction logs when emitted.
`Trade`: it stores the Trade information passed in transaction logs when emitted.

# Dependencies

- `@testing-library/jest-dom`: A library that provides custom jest matchers to simplify testing of React components.

- `@testing-library/react`: A testing library for React that provides simple and complete solutions for testing React components.

- `@testing-library/user-event`: A testing library that provides utility functions for testing user interaction with React components.

- `dotenv`: A zero-dependency module that loads environment variables from a .env file into process.env.

- `lodash`: A JavaScript library that provides utility functions for common programming tasks, including manipulation, iteration, and data manipulation.

- `moment`: A library for parsing, validating, manipulating, and formatting dates and times in JavaScript.

- `react`: it implement a render() method that takes input data and returns what to display

- `react-apexcharts`: A library for rendering interactive charts and graphs in React.

- `react-blockies`: A library for generating unique identicons with React.

- `react-dom`: A library that provides the DOM-specific methods for rendering and updating React components.

- `react-redux`: A library that provides a simple way to connect React components to a Redux store.

- `react-scripts`: A package that provides scripts and configuration for creating React apps with create-react-app.

- `redux`: A predictable state container for JavaScript apps that helps manage application state.

- `redux-devtools-extension`: A browser extension that provides a set of tools for debugging and monitoring Redux applications.

- `redux-thunk`: A middleware for Redux that allows for asynchronous actions to be dispatched.

- `reselect`: A library for creating efficient and composable selector functions for Redux.

- `web-vitals`: A library that provides an easy way to measure and track core web vitals, including loading speed, interactivity, and visual stability.

- `ethers`: A compact JavaScript library with full functionality for interacting with the Ethereum blockchain.

# Dev Dependencies

- `@nomiclabs/hardhat-ethers`: A library that provides a pre-configured instance of Ethers.js, a popular Ethereum JavaScript library, for use with Hardhat.

- `@nomiclabs/hardhat-waffle`: A library that provides easy-to-use testing tools for Ethereum smart contracts using the Waffle testing framework.

- `chai`: A BDD / TDD assertion library for Node.js and the browser that can be paired with any JavaScript testing framework.

- `ethereum-waffle`: A testing framework for Ethereum smart contracts that provides simple and intuitive ways to write tests, deploy contracts, and interact with them.

- `ethers`: A JavaScript library for working with the Ethereum blockchain that provides a simple and easy-to-use interface for developers.

- `hardhat`: A development environment that helps in testing, compiling, deploying, and debugging dApps on the Ethereum blockchain.

# License

This project is licensed under Grandida License - see the LICENSE.md file for details.
