import { Center, Grid, GridItem, Text } from "@chakra-ui/react";
import { Navbar } from "../layout";
import useAppState from "../../state";
import {
  Balance,
  MyTransactions,
  NewOrder,
  OrderBook,
  PriceChart,
  Trades,
} from "./index";
import useLoadOrders from "../../hooks/useLoadOrders";

export default function MainContent() {
  const [state] = useAppState();

  useLoadOrders();

  let content = null;
  if (!state.user?.account?.address) {
    content = (
      <GridItem colSpan={5} rowSpan={1} m="5rem" bg="blue.500">
        <Center height="100%">
          <Text>Please connect to your wallet</Text>
        </Center>
      </GridItem>
    );
  } else if (!state.contracts?.contractData) {
    content = (
      <GridItem colSpan={5} rowSpan={1} m="5rem" bg="blue.500">
        <Center height="100%">
          <Text>The current chain has no deployment. </Text>
          <Text>Please change the network</Text>
        </Center>
      </GridItem>
    );
  } else {
    content = (
      <>
        <GridItem gridRow="2 / 3" gridColumn="1 / span 1" bg="blue.500">
          <Balance />
        </GridItem>

        <GridItem
          gridRow="2 / 4"
          gridColumn="2 / 3"
          bg="blue.500"
          // overflow="auto"
        >
          <OrderBook />
        </GridItem>

        <GridItem gridRow="2 / span 1" gridColumn="3 / span 2" bg="blue.500">
          <PriceChart />
        </GridItem>

        <GridItem gridRow="2 / span 2" gridColumn="5" bg="blue.500">
          <Trades />
        </GridItem>

        <GridItem gridRow="3 / span 1" gridColumn="1" bg="blue.500">
          <NewOrder />
        </GridItem>

        <GridItem gridRow="3 / 4" gridColumn="3 / span 2" bg="blue.500">
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
        bg="blue.500"
      >
        <Navbar />
      </GridItem>

      {content}
    </Grid>
  );
}
