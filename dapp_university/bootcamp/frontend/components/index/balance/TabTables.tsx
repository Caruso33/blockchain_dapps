import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

const TabTables: React.FC = () => {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Token</Th>
            <Th>Wallet</Th>
            <Th>Exchange</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>ETH</Td>
            <Td isNumeric>2.8</Td>
            <Td isNumeric>0</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default TabTables;
