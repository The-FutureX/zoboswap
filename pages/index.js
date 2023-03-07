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

    // Reload page when network changes
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });

    // Fetch current account & balance from Metamask when changed
    window.ethereum.on("accountsChanged", () => {
      getAccount(provider, dispatch);
    });

    // Load token smart contracts
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
    getAllOrders(provider, exchange, dispatch);

    // Listen to events
    subscribeToEvents(exchange, dispatch);
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
