import { Flex, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";
import { chartConfig } from "./priceChart/chartConfig";
import useTradePriceChartEvents from "./priceChart/useTradePriceChartEvents";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PriceChart: React.FC = () => {
  const priceChartTrades = useTradePriceChartEvents();

  return (
    <Flex direction="column" m="1rem" height="inherit" width="inherit">
      <Text fontSize="xl" style={{ fontWeight: "bold" }}>
        PriceChart
      </Text>

      {typeof window !== "undefined" && (
        <Chart
          options={chartConfig}
          series={priceChartTrades}
          type="candlestick"
          width="90%"
          height="80%"
        />
      )}
    </Flex>
  );
};

export default PriceChart;
