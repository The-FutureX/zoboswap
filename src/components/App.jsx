import { useEffect } from "react";
import { useDispatch } from "react-redux";

//Internal Import
import config from "../config.json";
import {
  loadAccount,
  loadNetwork,
  loadProvider,
  loadTokens,
  loadExchange,
  subscribeToEvents,
} from "../store/interactions";
import Balance from "./Balance";
import Markets from "./Markets";
import Navbar from "./Navbar";

const App = () => {
  const dispatch = useDispatch();

  const loadBlockchainData = async () => {
    // Connect Ethers to blockchain
    const provider = loadProvider(dispatch);

    // Fetch current network's chainId (e.g. hardhat: 31337, kovan: 42)
    const chainId = await loadNetwork(provider, dispatch);

    // Reload page when network changes
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });

    // Fetch current account & balance from Metamask when changed
    window.ethereum.on("accountsChanged", () => {
      loadAccount(provider, dispatch);
    });

    // Load token smart contracts
    const mZOBO = config[chainId].mZOBO;
    const mETH = config[chainId].mETH;
    await loadTokens(provider, [mZOBO.address, mETH.address], dispatch);

    // Load exchange smart contract
    const exchangeConfig = config[chainId].exchange;
    const exchange = await loadExchange(
      provider,
      exchangeConfig.address,
      dispatch
    );

    // Listen to events
    subscribeToEvents(exchange, dispatch);
  };

  useEffect(() => {
    loadBlockchainData();
  });

  return (
    <div>
      <Navbar />

      <main className="exchange grid">
        <section className="exchange__section--left grid">
          <Markets />

          <Balance />

          {/* Order */}
        </section>
        <section className="exchange__section--right grid">
          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}
        </section>
      </main>
      {/* Alert */}
    </div>
  );
};

export default App;
