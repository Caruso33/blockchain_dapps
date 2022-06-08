import {
  Flex,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import formatISO9075 from "date-fns/formatISO9075";
import React from "react";
import useMakeOrderEvents, {
  MakeOrderEventEnhanced,
} from "./trades/useMakeOrderEvents";
import useTradeEvents, { TradeEventEnhanced } from "./trades/useTradeEvents";

const MyTransactions: React.FC = () => {
  const [, myTradeEvents] = useTradeEvents();
  const [, , , myOrders] = useMakeOrderEvents();

  return (
    <Flex direction="column" m="1rem" height="100%">
      <Text fontSize="xl" style={{ fontWeight: "bold" }}>
        MyTransactions
      </Text>

      <Tabs mt="1rem" overflowY="auto">
        <TabList>
          <Tab>Trades</Tab>
          <Tab>Orders</Tab>
        </TabList>

        <TabPanels fontSize="sm">
          <TabPanel>
            <TableContainer>
              <Table variant="simple" fontSize="sm">
                <Thead>
                  <Tr>
                    <Th>Time</Th>
                    <Th>TOKEN</Th>
                    <Th>TOKEN/ETH</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {myTradeEvents.map((event: TradeEventEnhanced, i) => (
                    <Tr key={`my-trades-${i}`}>
                      <Td>{formatISO9075(event.dateTime)}</Td>
                      <Td isNumeric>
                        <Text
                          color={
                            event.orderType === "buy" ? "green.200" : "red.200"
                          }
                        >
                          {event.orderType === "buy" ? "+" : "-"}
                          {event.tokenAmount.toNumber()}
                        </Text>
                      </Td>
                      <Td isNumeric>{event.tokenPrice}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel>
            <TableContainer>
              <Table variant="simple" fontSize="sm">
                <Thead>
                  <Tr>
                    <Th>Time</Th>
                    <Th>TOKEN</Th>
                    <Th>TOKEN/ETH</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {myOrders.map((event: MakeOrderEventEnhanced, i) => (
                    <Tr key={`my-orders-${i}`}>
                      <Td>{i}</Td>
                      <Td isNumeric>{event.tokenAmount.toNumber()}</Td>
                      <Td isNumeric>{event.tokenPrice}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default MyTransactions;
