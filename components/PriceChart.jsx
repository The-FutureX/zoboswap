import { useSelector } from "react-redux";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import arrowDown from "../public/assets/down-arrow.svg";
import arrowUp from "../public/assets/up-arrow.svg";

import { defaultSeries, options } from "./PriceChart.config";

import { priceChartSelector } from "../store/selectors";

import ChartBoard from "./ChartBoard";
import Image from "next/image";

const PriceChart = () => {
  const account = useSelector((state) => state.provider.account);
  const symbols = useSelector((state) => state.tokens.symbols);
  const priceChart = useSelector(priceChartSelector);

  return (
    <div className="component exchange__chart">
      <div className="component__header flex-between">
        <div className="flex">
          <h2>{symbols && `${symbols[0]}/${symbols[1]}`}</h2>
          {priceChart && (
            <div className="flex">
              {priceChart.lastPriceChange === "+" ? (
                <Image src={arrowUp} alt="Arrow up" />
              ) : (
                <Image src={arrowDown} alt="Arrow down" />
              )}

              <span className="up">{priceChart.lastPrice}</span>
            </div>
          )}
        </div>
      </div>

      {!account ? (
        <ChartBoard text={"Please connect with Metamask"} />
      ) : (
        <Chart
          type="candlestick"
          options={options}
          series={priceChart ? priceChart.series : defaultSeries}
          // series={priceChart ? priceChart.series : series}
          // series={series}
          width="100%"
          height="100%"
        />
      )}
    </div>
  );
};

export default PriceChart;
