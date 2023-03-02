# Title

ZoboSwap DEX

# Description

ZoboExchange is a decentralized exchange that operates on the Polygon blockchain, which is a layer 2 scaling solution for Ethereum. This means that transactions on Zobo Exchange are processed and settled on the Polygon blockchain, providing users with fast and low-cost trading experience. ZoboExchange offers a decentralized and trustless platform for users to trade cryptocurrencies, where they have full control over their funds. ZoboToken is the native token of ZoboSwap and is used as a means of payment for trading fees.

# Snapshot

![ZoboExchange](/screenshots/zoboswap.png)

# Link

ZoboExchnage is a decentralized exchange (DEX) built on the polygon blockchain. It allows for the buying and selling of various cryptocurrencies.

Github Link: https://github.com/The-FutureX/zoboswap

Production Link: https://zoboswap-frontend.vercel.app/

# Authors

Oluwatimilehin Bello
Github Link: https://github.com/Timilehin-bello

Abiye Chris. I. Surulere
Github Link: https://github.com/suruabiye

Toluwani Olugbesan
Github Link: https://github.com/Tolu1

Ruth Ogban
Github Link: https://github.com/RuthO1

Kingsley Onoh
Github Link: https://github.com/KingsleyOnoh38

# How to Install and Run the Project

**Clone the repository**

```javascript
https://github.com/The-FutureX/zoboswap.git
```

**cd into the Project Folder**

```bash
cd zoboswap
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
npx hardhat run --network localhost ./script/deploy.js
```

**!!IMPORTANT: Run the Seed Script to have the seed data on the exchange app**

```javascript
npx hardhat run --network localhost ./script/seed-exchange.js
```

**Start the development server**

```javascript
npm run dev
```

**Port to Run the Website**

```
http://localhost:3000
```

## Metamask Setup

- Ensure you are using the `Mumbai Test Network` on your `metamask wallet` or any other wallet when connecting.

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

https://mumbai.polygonscan.com/address/0x751DAB408F32d0D524dd31dFABEfCc5502ff8A1e

With this address:

```
0x751DAB408F32d0D524dd31dFABEfCc5502ff8A1e
```

On the `MUMBAI TESTNET`.

<br>

The SiToken token smart contract was deployed at:

https://mumbai.polygonscan.com/address/0x4A201668C556cee22D08196a681A0A6645f5bF91

With this address:

```
0x4A201668C556cee22D08196a681A0A6645f5bF91
```

On the `MUMBAI TESTNET`.

<br>

The SuToken token smart contract was deployed at:

https://mumbai.polygonscan.com/address/0xc07DeDB9c370404D09FB6f2A8Ec62614C1A9f045

With this address:

```
0xc07DeDB9c370404D09FB6f2A8Ec62614C1A9f045
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

https://mumbai.polygonscan.com/address/0xFBff418329eD6ed52A1cee2310331FC8f3084518

With this address:

```
0xFBff418329eD6ed52A1cee2310331FC8f3084518
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

`feeAccount`: Stores the address where service fee is paid

`feePercent`: Stores the fee percentage

`orderCount`: This variable stores the number of orders.

## Functions

`depositToken`: Deposits token into liquidity pool.

`withdrawToken`: Withdraws token into liquidity pool.

`balanceOf`: Check Balances of an address.

`makeOrder`: Creates a new order.

`cancelOrder`: Cancels existing orders.

`fillOrder`: Fills orders and Charge Fees.

`_trade`: Facilitates trade between token buyer and seller.

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
