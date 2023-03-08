import { ethers } from "ethers";
import TOKEN_ABI from "../abis/Token.json";
import EXCHANGE_ABI from "../abis/Exchange.json";

export const getProvider = (dispatch) => {
  const connection = new ethers.providers.Web3Provider(window.ethereum);
  dispatch({ type: "PROVIDER_LOADED", connection });

  return connection;
};

export const ensureNetwork = async (local = true) => {
  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  let condition;
  if (local) {
    condition =
      chainId !== `0x${(80001).toString(16)}` &&
      chainId !== `0x${(31337).toString(16)}`;
  } else {
    condition = chainId !== `0x${(80001).toString(16)}`;
  }
  if (condition) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13881" }],
      });
      console.log("You have switched to the right network");
    } catch (switchError) {
      console.log(switchError);
      // The network has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x13881",
                chainName: "Mumbai Testnet",
                rpcUrls: [
                  "https://polygon-mumbai.g.alchemy.com/v2/KBuX4MEvHnuxz1qVl9Rd-QKqEl0WUVWW",
                ],
                blockExplorerUrls: ["https://polygonscan.com/"],
                nativeCurrency: {
                  symbol: "MATIC",
                  decimals: 18,
                },
              },
            ],
          });
        } catch (err) {
          console.log(err);
        }
      }
      console.log("Cannot switch to the network");
    }
  }
};

export const getNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork();
  dispatch({ type: "NETWORK_LOADED", chainId });

  return chainId;
};

export const getAccount = async (provider, dispatch) => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  const account = ethers.utils.getAddress(accounts[0]);

  dispatch({ type: "ACCOUNT_LOADED", account });

  let balance = await provider.getBalance(account);
  balance = ethers.utils.formatEther(balance);

  dispatch({ type: "ETHER_BALANCE_LOADED", balance });

  return account;
};

export const getTokens = async (provider, addresses, dispatch) => {
  let token, symbol;

  token = new ethers.Contract(addresses[0], TOKEN_ABI, provider);
  symbol = await token.symbol();
  dispatch({ type: "TOKEN_1_LOADED", token, symbol });

  token = new ethers.Contract(addresses[1], TOKEN_ABI, provider);
  symbol = await token.symbol();
  dispatch({ type: "TOKEN_2_LOADED", token, symbol });

  return token;
};

export const getExchange = async (provider, address, dispatch) => {
  const exchange = new ethers.Contract(address, EXCHANGE_ABI, provider);
  dispatch({ type: "EXCHANGE_LOADED", exchange });

  return exchange;
};

export const subscribeToEvents = (exchange, dispatch) => {
  exchange.on(
    "Cancel",
    (
      id,
      user,
      tokenGet,
      amountGet,
      tokenGive,
      amountGive,
      timestamp,
      event
    ) => {
      const order = event.args;
      dispatch({ type: "ORDER_CANCEL_SUCCESS", order, event });
    }
  );

  exchange.on(
    "Trade",
    (
      id,
      user,
      tokenGet,
      amountGet,
      tokenGive,
      amountGive,
      creator,
      timestamp,
      event
    ) => {
      const order = event.args;
      dispatch({ type: "ORDER_FILL_SUCCESS", order, event });
    }
  );

  exchange.on("Deposit", (token, user, amount, balance, event) => {
    dispatch({ type: "TRANSFER_SUCCESS", event });
  });

  exchange.on("Withdraw", (token, user, amount, balance, event) => {
    dispatch({ type: "TRANSFER_SUCCESS", event });
  });

  exchange.on(
    "Order",
    (
      id,
      user,
      tokenGet,
      amountGet,
      tokenGive,
      amountGive,
      timestamp,
      event
    ) => {
      const order = event.args;
      dispatch({ type: "NEW_ORDER_SUCCESS", order, event });
    }
  );
};

/*********LOAD USER BALANCES (WALLET & EXCHANGE BALANCES)**********/
export const getBalances = async (exchange, tokens, account, dispatch) => {
  let balance = ethers.utils.formatUnits(
    await tokens[0].balanceOf(account),
    18
  );
  dispatch({ type: "TOKEN_1_BALANCE_LOADED", balance });

  balance = ethers.utils.formatUnits(
    await exchange.balanceOf(tokens[0].address, account),
    18
  );
  dispatch({ type: "EXCHANGE_TOKEN_1_BALANCE_LOADED", balance });

  balance = ethers.utils.formatUnits(await tokens[1].balanceOf(account), 18);
  dispatch({ type: "TOKEN_2_BALANCE_LOADED", balance });

  balance = ethers.utils.formatUnits(
    await exchange.balanceOf(tokens[1].address, account),
    18
  );
  dispatch({ type: "EXCHANGE_TOKEN_2_BALANCE_LOADED", balance });
};

/*************************LOAD ALL ORDERS****************************/

export const getAllOrders = async (provider, exchange, dispatch) => {
  const block = await provider.getBlockNumber();

  // Fetch canceled orders
  const cancelStream = await exchange.queryFilter("Cancel", 0, block);
  const cancelledOrders = cancelStream.map((event) => event.args);

  dispatch({ type: "CANCELLED_ORDERS_LOADED", cancelledOrders });

  // Fetch filled orders
  const tradeStream = await exchange.queryFilter("Trade", 0, block);
  const filledOrders = tradeStream.map((event) => event.args);

  dispatch({ type: "FILLED_ORDERS_LOADED", filledOrders });

  // Fetch all orders
  const orderStream = await exchange.queryFilter("Order", 0, block);
  const allOrders = orderStream.map((event) => event.args);

  dispatch({ type: "ALL_ORDERS_LOADED", allOrders });
};

/****************TRANSFER TOKENS (DEPOSIT & WITHDRAWS******************/
export const transferTokens = async (
  provider,
  exchange,
  transferType,
  token,
  amount,
  dispatch
) => {
  let transaction;

  dispatch({ type: "TRANSFER_REQUEST" });

  try {
    const signer = await provider.getSigner();
    const amountToTransfer = ethers.utils.parseUnits(amount.toString(), 18);

    if (transferType === "Deposit") {
      transaction = await token
        .connect(signer)
        .approve(exchange.address, amountToTransfer);
      await transaction.wait();
      transaction = await exchange
        .connect(signer)
        .depositToken(token.address, amountToTransfer);
    } else {
      transaction = await exchange
        .connect(signer)
        .withdrawToken(token.address, amountToTransfer);
    }

    await transaction.wait();
  } catch (error) {
    dispatch({ type: "TRANSFER_FAIL" });
  }
};

/********************** ORDERS (BUY & SELL) **************************/

export const makeBuyOrder = async (
  provider,
  exchange,
  tokens,
  order,
  dispatch
) => {
  const tokenGet = tokens[0].address;
  const amountGet = ethers.utils.parseUnits(order.amount, 18);
  const tokenGive = tokens[1].address;
  const amountGive = ethers.utils.parseUnits(
    (order.amount * order.price).toString(),
    18
  );

  dispatch({ type: "NEW_ORDER_REQUEST" });

  try {
    const signer = await provider.getSigner();
    const transaction = await exchange
      .connect(signer)
      .makeOrder(tokenGet, amountGet, tokenGive, amountGive);
    await transaction.wait();
  } catch (error) {
    dispatch({ type: "NEW_ORDER_FAIL" });
  }
};

export const makeSellOrder = async (
  provider,
  exchange,
  tokens,
  order,
  dispatch
) => {
  const tokenGet = tokens[1].address;
  const amountGet = ethers.utils.parseUnits(
    (order.amount * order.price).toString(),
    18
  );
  const tokenGive = tokens[0].address;
  const amountGive = ethers.utils.parseUnits(order.amount, 18);

  dispatch({ type: "NEW_ORDER_REQUEST" });

  try {
    const signer = await provider.getSigner();
    const transaction = await exchange
      .connect(signer)
      .makeOrder(tokenGet, amountGet, tokenGive, amountGive);
    await transaction.wait();
  } catch (error) {
    dispatch({ type: "NEW_ORDER_FAIL" });
  }
};

/*************************** CANCEL ORDER *****************************/

export const cancelOrder = async (provider, exchange, order, dispatch) => {
  dispatch({ type: "ORDER_CANCEL_REQUEST" });

  try {
    const signer = await provider.getSigner();
    const transaction = await exchange.connect(signer).cancelOrder(order.id);
    await transaction.wait();
  } catch (error) {
    dispatch({ type: "ORDER_CANCEL_FAIL" });
  }
};

// FILL ORDER

export const fillOrder = async (provider, exchange, order, dispatch) => {
  dispatch({ type: "ORDER_FILL_REQUEST" });

  try {
    const signer = await provider.getSigner();
    const transaction = await exchange.connect(signer).fillOrder(order.id);
    await transaction.wait();
  } catch (error) {
    dispatch({ type: "ORDER_FILL_FAIL" });
  }
};
