import {
  Box,
  Button,
  Flex,
  Input,
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
import { ethers } from "ethers";
import React from "react";
import useLoadBalances from "../../hooks/useLoadBalances";
import useAppState from "../../state";

const Balance: React.FC = () => {
  const [state] = useAppState();

  useLoadBalances();

  const { ether, token, exchangeEther, exchangeToken } = state?.user?.balances;

  return (
    <Flex flexDirection="column" p="1rem" height="inherit" width="inherit">
      <Box>
        <Text fontSize="xl" style={{ fontWeight: "bold" }}>
          Balance
        </Text>
      </Box>

      <Tabs fontSize="sm" mt="1rem" overflowX="auto" overflowY="auto">
        <TabList>
          <Tab>Deposit</Tab>
          <Tab>Withdraw</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Asset</Th>
                    <Th>Amount</Th>
                    <Th>Location</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>ETH</Td>
                    <Td isNumeric>
                      {Number(
                        ethers.utils.formatUnits(ether?.toString() || "0")
                      ).toFixed(3)}
                    </Td>
                    <Td isNumeric>Origin</Td>
                  </Tr>

                  <Tr>
                    <Td>ETH</Td>
                    <Td isNumeric>
                      {Number(
                        ethers.utils.formatUnits(
                          exchangeEther?.toString() || "0"
                        )
                      ).toFixed(3)}
                    </Td>
                    <Td isNumeric>Exchange</Td>
                  </Tr>

                  <Tr>
                    <Td>TOKEN</Td>
                    <Td isNumeric>
                      {Number(
                        ethers.utils.formatUnits(token?.toString() || "0")
                      ).toFixed(3)}
                    </Td>
                    <Td isNumeric>Origin</Td>
                  </Tr>

                  <Tr>
                    <Td>TOKEN</Td>
                    <Td isNumeric>
                      {Number(
                        ethers.utils.formatUnits(
                          exchangeToken?.toString() || "0"
                        )
                      ).toFixed(3)}
                    </Td>
                    <Td isNumeric>Exchange</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Flex direction="column" fontSize="sm" mt="0.5rem">
        <Flex>
          <Input placeholder="Eth Amount" />{" "}
          <Button ml="0.5rem">Deposit</Button>
        </Flex>

        <Box mt="0.5rem">Dapp Balance</Box>

        <Flex mt="0.5rem">
          <Input placeholder="Token Amount" />{" "}
          <Button ml="0.5rem">Deposit</Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Balance;
