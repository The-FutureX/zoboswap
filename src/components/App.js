import { useEffect } from "react";
import { useDispatch } from "react-redux";

//Internal Import
import config from "../config.json";
import {
  loadAccount,
  loadNetwork,
  loadProvider,
  loadToken,
} from "../store/interactions";

const App = () => {
  const dispatch = useDispatch();

  const loadBlockchainData = async () => {
    // laod Account
    await loadAccount(dispatch);

    // Connect Ethers to Blockchain
    const provider = loadProvider(dispatch);
    const chainId = await loadNetwork(provider, dispatch);

    // Token Smart Contract
    await loadToken(provider, config[chainId].zoboCoin.address, dispatch);
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
