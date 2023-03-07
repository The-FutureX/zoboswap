import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Alert,
  Balance,
  Markets,
  TopNav,
  Order,
  OrderBook,
  PriceChart,
  Trades,
  Transactions,
} from "../components/componentsIndex";

//Internal Import
import config from "../config.json";
import {
  getAccount,
  getNetwork,
  getProvider,
  getTokens,
  getExchange,
  getAllOrders,
  subscribeToEvents,
} from "../store/interactions";

const App = () => {
  const dispatch = useDispatch();

  const getBlockchainData = async () => {
    // Connect Ethers to blockchain
    const provider = getProvider(dispatch);

    // Fetch current network's chainId
    const chainId = await getNetwork(provider, dispatch);

    const supportedNetwork = [
      { id: 80001, name: "Mumbai Testnet" },
      { id: 31337, name: "Localhost" },
    ];

    // Reload page when network changes
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });

    // Fetch current account & balance from Metamask when changed
    window.ethereum.on("accountsChanged", () => {
      getAccount(provider, dispatch);
    });

    // Check if ChainId exists in the supported chain..
    const found = supportedNetwork.some((obj) => obj.id === chainId);
    if (found) {
      // continue..

      // get token smart contracts
      const ZoboToken = config[chainId].ZoboToken;
      const SiToken = config[chainId].SiToken;
      await getTokens(provider, [ZoboToken.address, SiToken.address], dispatch);

      // Load exchange smart contract
      const exchangeConfig = config[chainId].exchange;
      const exchange = await getExchange(
        provider,
        exchangeConfig.address,
        dispatch
      );

      // Fetch all orders: open, filled, cancelled
      await getAllOrders(provider, exchange, dispatch);

      // Listen to events
      subscribeToEvents(exchange, dispatch);
    } else {
      alert("Please Change to either Mumbai testnet or Localhost");
    }
  };

  useEffect(() => {
    getBlockchainData();
  });

  return (
    <div>
      <TopNav />

      <main className="exchange grid">
        <section className="exchange__section--left grid">
          <Alert />

          <Markets />

          <Balance />

          <Order />
        </section>
        <section className="exchange__section--right grid">
          <PriceChart />

          <Transactions />

          <Trades />

          <OrderBook />
        </section>
      </main>
    </div>
  );
};

export default App;
