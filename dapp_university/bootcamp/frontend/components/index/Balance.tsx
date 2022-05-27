import React from "react";
import {
  Flex,
  Box,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
} from "@chakra-ui/react";
import TabTables from "./balance/TabTables";

const Balance: React.FC = () => {
  return (
    <Flex flexDirection="column" m="1rem">
      <Box>
        <Text fontSize="xl" style={{ fontWeight: "bold" }}>
          Balance
        </Text>
      </Box>

      <Tabs>
        <TabList>
          <Tab>Deposit</Tab>
          <Tab>Withdraw</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <TabTables />
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Flex mt="0.5rem">
        <Input placeholder="Eth Amount" /> <Button ml="0.5rem">Deposit</Button>
      </Flex>

      <Box mt="0.5rem">Dapp Balance</Box>

      <Flex mt="0.5rem">
        <Input placeholder="Token Amount" />{" "}
        <Button ml="0.5rem">Deposit</Button>
      </Flex>
    </Flex>
  );
};

export default Balance;
