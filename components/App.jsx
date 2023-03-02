// import { useEffect } from "react";
// import { useDispatch } from "react-redux";

// //Internal Import
// import config from "../config.json";
// import {
//   loadAccount,
//   loadNetwork,
//   loadProvider,
//   loadTokens,
//   loadExchange,
//   loadAllOrders,
//   subscribeToEvents,
// } from "../store/interactions";
// import Alert from "./Alert";
// import Balance from "./Balance";
// import Markets from "./Markets";
// import Navbar from "./Navbar";
// import Order from "./Order";
// import OrderBook from "./OrderBook";
// import PriceChart from "./PriceChart";
// import Trades from "./Trades";
// import Transactions from "./Transactions";

// const App = () => {
//   const dispatch = useDispatch();

//   const loadBlockchainData = async () => {
//     // Connect Ethers to blockchain
//     const provider = loadProvider(dispatch);

//     // Fetch current network's chainId (e.g. hardhat: 31337, kovan: 42)
//     const chainId = await loadNetwork(provider, dispatch);

//     // Reload page when network changes
//     window.ethereum.on("chainChanged", () => {
//       window.location.reload();
//     });

//     // Fetch current account & balance from Metamask when changed
//     window.ethereum.on("accountsChanged", () => {
//       loadAccount(provider, dispatch);
//     });

//     // Load token smart contracts
//     const ZoboToken = config[chainId].ZoboToken;
//     const SiToken = config[chainId].SiToken;
//     await loadTokens(provider, [ZoboToken.address, SiToken.address], dispatch);

//     // Load exchange smart contract
//     const exchangeConfig = config[chainId].exchange;
//     const exchange = await loadExchange(
//       provider,
//       exchangeConfig.address,
//       dispatch
//     );

//     // Fetch all orders: open, filled, cancelled
//     loadAllOrders(provider, exchange, dispatch);

//     // Listen to events
//     subscribeToEvents(exchange, dispatch);
//   };

//   useEffect(() => {
//     loadBlockchainData();
//   });

//   return (
//     <div>
//       <Navbar />

//       <main className="exchange grid">
//         <section className="exchange__section--left grid">
//           <Markets />

//           <Balance />

//           <Order />
//         </section>
//         <section className="exchange__section--right grid">
//           <PriceChart />

//           <Transactions />

//           <Trades />

//           <OrderBook />
//         </section>
//         <Alert />
//       </main>
//     </div>
//   );
// };

// export default App;
