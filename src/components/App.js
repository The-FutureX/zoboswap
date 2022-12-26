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
} from "../store/interactions";

const App = () => {
  const dispatch = useDispatch();

  const loadBlockchainData = async () => {
    // Connect Ethers to Blockchain
    const provider = loadProvider(dispatch);

    // Fetch current network's chainId (e.g hardhat: 31337, kovan: 42)
    const chainId = await loadNetwork(provider, dispatch);

    // Fetch/Laod account & balance from Metamask
    await loadAccount(provider, dispatch);

    // Load token smart contracts
    const zoboCoin = config[chainId].zoboCoin;
    const mETH = config[chainId].mETH;
    await loadTokens(provider, [zoboCoin.address, mETH.address], dispatch);

    // Load exchange smart contract
    const exchangeConfig = config[chainId].exchange;
    await loadExchange(provider, exchangeConfig.address, dispatch);
  };

  useEffect(() => {
    loadBlockchainData();
  });

  return (
    <div>
      {/* Navbar */}

      <main className="exchange grid">
        <section className="exchange__section--left grid">
          {/* Markets */}

          {/* Balance */}

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
