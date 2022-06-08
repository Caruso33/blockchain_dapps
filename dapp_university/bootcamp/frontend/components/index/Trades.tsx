import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import formatISO9075 from "date-fns/formatISO9075";
import React from "react";
import useTradeEvents, { TradeEventWithAmount } from "./trades/useTradeEvents";

const Trades: React.FC = () => {
  const tradeEvents = useTradeEvents();

  console.log(tradeEvents);

  return (
    <Flex m="1rem" direction="column">
      <Text fontSize="xl" style={{ fontWeight: "bold" }}>
        Trades
      </Text>

      <TableContainer mt="1rem">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Time</Th>
              <Th>TOKEN</Th>
              <Th>TOKEN/ETH</Th>
            </Tr>
          </Thead>

          <Tbody>
            {tradeEvents.map((tradeEvent: TradeEventWithAmount) => (
              <Tr key={tradeEvent.id}>
                <Td>{formatISO9075(tradeEvent.dateTime)}</Td>
                <Td isNumeric>{tradeEvent.tokenAmount.toNumber()}</Td>
                <Td isNumeric>{tradeEvent.tokenPrice}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default Trades;
