import { Center, Grid, GridItem, Text } from "@chakra-ui/react";
import {
  useLoadCancelOrderEvents,
  useLoadMakeOrderEvents,
  useLoadTradeOrderEvents,
} from "../../hooks/useLoadOrderEvents";
import useAppState from "../../state";
import { Navbar } from "../layout";
import {
  Balance,
  MyTransactions,
  NewOrder,
  OrderBook,
  PriceChart,
  Trades,
} from "./index";
import {
  useLoadDepositEvents,
  useLoadWithdrawalEvents,
} from "../../hooks/useLoadDepositEvents.ts";

export default function MainContent() {
  const [state] = useAppState();

  useLoadMakeOrderEvents();
  useLoadCancelOrderEvents();
  useLoadTradeOrderEvents();

  useLoadDepositEvents();
  useLoadWithdrawalEvents();

  let content = null;
  if (!state.user?.account?.address) {
    content = (
      <GridItem colSpan={5} rowSpan={1} m="5rem" bg="blue.800">
        <Center height="100%">
          <Text>Please connect to your wallet</Text>
        </Center>
      </GridItem>
    );
  } else if (!state.contracts?.contractData) {
    content = (
      <GridItem colSpan={5} rowSpan={1} m="5rem" bg="blue.800">
        <Center height="100%">
          <Text>The current chain has no deployment.</Text>
          <br />
          <Text>Please change the network</Text>
          <br />
          <Text>Current supported chains {["Polygon Mumbai"].join(", ")}</Text>
        </Center>
      </GridItem>
    );
  } else {
    content = (
      <>
        <GridItem
          gridRow="2 / 3"
          gridColumn="1 / span 1"
          width="100%"
          height="100%"
          bg="blue.800"
        >
          <Balance />
        </GridItem>

        <GridItem
          gridRow="2 / 4"
          gridColumn="2 / 3"
          width="100%"
          height="100%"
          bg="blue.800"
        >
          <OrderBook />
        </GridItem>

        <GridItem
          gridRow="2 / span 1"
          gridColumn="3 / span 2"
          width="100%"
          height="100%"
          bg="blue.800"
        >
          <PriceChart />
        </GridItem>

        <GridItem
          gridRow="2 / span 2"
          gridColumn="5"
          width="100%"
          height="100%"
          bg="blue.800"
        >
          <Trades />
        </GridItem>

        <GridItem
          gridRow="3 / span 1"
          gridColumn="1"
          width="100%"
          height="100%"
          bg="blue.800"
        >
          <NewOrder />
        </GridItem>

        <GridItem
          gridRow="3 / 4"
          gridColumn="3 / span 2"
          width="100%"
          height="100%"
          bg="blue.800"
        >
          <MyTransactions />
        </GridItem>
      </>
    );
  }

  return (
    <Grid
      templateColumns="repeat(5, 1fr)"
      templateRows="5vh repeat(2, 45vh)"
      gap={3}
    >
      <GridItem
        gridRow="1 / span 1"
        gridColumn="span 5"
        h="5vh"
        minHeight="10"
        width="100%"
        height="100%"
        bg="blue.500"
      >
        <Navbar />
      </GridItem>

      {content}
    </Grid>
  );
}
