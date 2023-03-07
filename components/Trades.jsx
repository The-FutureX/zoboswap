import Image from "next/image";
import { useSelector } from "react-redux";

import sort from "../public/assets/sort.svg";

import { filledOrdersSelector } from "../store/selectors";

import Board from "./Board";

const Trades = () => {
  const symbols = useSelector((state) => state.tokens.symbols);
  const filledOrders = useSelector(filledOrdersSelector);

  return (
    <div className="component exchange__trades">
      <div className="component__header flex-between">
        <h2>Trades</h2>
      </div>

      {!filledOrders || filledOrders.length === 0 ? (
        <Board text="No Transactions" />
      ) : (
        <table>
          <thead>
            <tr>
              <th>
                Time
                <Image src={sort} alt="Sort" />
              </th>
              <th>
                {symbols && symbols[0]}
                <Image src={sort} alt="Sort" />
              </th>
              <th>
                {symbols && symbols[0]}/{symbols && symbols[1]}
                <Image src={sort} alt="Sort" />
              </th>
            </tr>
          </thead>
          <tbody>
            {/* MAPPING OF ORDERS... */}

            {filledOrders &&
              filledOrders.map((order, index) => {
                return (
                  <tr key={index}>
                    <td>{order.formattedTimestamp}</td>
                    <td style={{ color: `${order.tokenPriceClass}` }}>
                      {order.token0Amount}
                    </td>
                    <td>{order.tokenPrice}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Trades;