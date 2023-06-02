import { useSelector, useDispatch } from "react-redux";
import Blockies from "react-blockies";

import logo from "../public/assets/logo.png";
import eth from "../public/assets/eth.svg";

import { getAccount, ensureNetwork } from "../store/interactions";

import config from "../config.json";
import Image from "next/image";

const TopNav = () => {
  const provider = useSelector((state) => state.provider.connection);
  const chainId = useSelector((state) => state.provider.chainId);
  const account = useSelector((state) => state.provider.account);
  const balance = useSelector((state) => state.provider.balance);

  const dispatch = useDispatch();

  const connectHandler = async () => {
    await getAccount(provider, dispatch);
    ensureNetwork();
  };

  const networkHandler = async (e) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: e.target.value }],
      });
    } catch (err) {
      // The network has not been added to MetaMask
      if (err.code === 4902) {
        const local = false;
        ensureNetwork(local);
      }
    }
  };

  return (
    <div className="exchange__header grid">
      <div className="exchange__header--brand flex">
        <Image src={logo} className="logo" alt="DApp Logo" />
        <h1 className="blue-clr">Zobo Token Exchange</h1>
      </div>

      <div className="exchange__header--networks flex">
        <Image src={eth} alt="ETH Logo" className="Eth Logo" />

        {chainId && (
          <select
            name="networks"
            id="networks"
            value={config[chainId] ? `0x${chainId.toString(16)}` : `0`}
            onChange={networkHandler}
          >
            <option value="0" disabled>
              Select Network
            </option>
            <option value="0x7A69">Localhost</option>
            <option value="0x13881">Mumbai</option>
          </select>
        )}
      </div>

      <div className="exchange__header--account flex">
        {balance ? (
          <p>
            <small>My Balance</small>
            {Number(balance).toFixed(4)}
          </p>
        ) : (
          <p>
            <small>My Balance</small>0 ETH
          </p>
        )}
        {account ? (
          <a
            href={
              config[chainId]
                ? `${config[chainId].explorerURL}/address/${account}`
                : `#`
            }
            target="_blank"
            rel="noreferrer"
          >
            {account.slice(0, 5) + "..." + account.slice(38, 42)}
            <Blockies
              seed={account}
              size={10}
              scale={3}
              color="#2187D0"
              bgColor="#F1F2F9"
              spotColor="#767F92"
              className="identicon"
            />
          </a>
        ) : (
          <button className="button" onClick={connectHandler}>
            Connect
          </button>
        )}
      </div>
    </div>
  );
};

export default TopNav;
