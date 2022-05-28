import React from "react";
import {
  Flex,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
  TableContainer,
} from "@chakra-ui/react";

const OrderBook: React.FC = () => {
  return (
    <Flex flexDirection="column" m="1rem">
      <Text fontSize="xl" style={{ fontWeight: "bold" }}>
        OrderBook
      </Text>

      <TableContainer>
        <Table variant="simple">
          <Tbody>
            {Array.from({ length: 10 }).map((_, index) => (
              <Tr key={index + "bid"}>
                <Td>{100 - index * 10}</Td>
                <Td isNumeric color="red">
                  {/* {Math.random()} */}
                </Td>
                <Td isNumeric>0.01</Td>
              </Tr>
            ))}

            <Tr>
              <Td>Dapp Exchange</Td>
              <Td>DAPP/ETH</Td>
              <Td>ETH</Td>
            </Tr>

            {Array.from({ length: 10 }).map((_, index) => (
              <Tr key={index + "ask"}>
                <Td>{index * 10}</Td>
                <Td isNumeric color="green">
                  {/* {Math.random()} */}
                </Td>
                <Td isNumeric>0.01</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default OrderBook;
