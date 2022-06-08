import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import useMakeOrderEvents, {
  MakeOrderEventEnhanced,
} from "./trades/useMakeOrderEvents";

const OrderBook: React.FC = () => {
  const [, buyOrders, sellOrders] = useMakeOrderEvents();

  return (
    <Flex flexDirection="column" m="1rem">
      <Text fontSize="xl" style={{ fontWeight: "bold" }}>
        OrderBook
      </Text>

      <TableContainer>
        <Table variant="simple">
          <Tbody>
            {buyOrders.map((order: MakeOrderEventEnhanced, index) => (
              <Tr key={"bid" + index}>
                <Td isNumeric>{order.tokenAmount.toNumber()}</Td>
                <Td isNumeric color="green">
                  {order.tokenPrice}
                </Td>
                <Td isNumeric>{order.etherAmount.toNumber()}</Td>
              </Tr>
            ))}

            <Tr>
              <Td>TOKEN</Td>
              <Td>TOKEN/ETH</Td>
              <Td>ETH</Td>
            </Tr>

            {sellOrders
              .reverse()
              .map((order: MakeOrderEventEnhanced, index) => (
                <Tr key={"ask" + index}>
                  <Td isNumeric>{order.tokenAmount.toNumber()}</Td>
                  <Td isNumeric color="red">
                    {order.tokenPrice}
                  </Td>
                  <Td isNumeric>{order.etherAmount.toNumber()}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default OrderBook;
