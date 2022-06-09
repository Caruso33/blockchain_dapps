import React, { useEffect } from "react";
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
import useAppState from "../../state";
import { useProvider } from "wagmi";
import { ethers } from "ethers";

const Balance: React.FC = () => {
  const [state, dispatch] = useAppState();
  const provider = useProvider();

  useEffect(() => {
    async function loadBalances() {
      const { tokenContract, exchangeContract } = state.contracts;
      const { account } = state.user;

      if (!tokenContract || !exchangeContract || !account) {
        return;
      }

      try {
        const etherBalance = await provider.getBalance(account?.address);
        console.log({ etherBalance: etherBalance.toString() });

        const exchangeEtherBalance = await exchangeContract.balanceOf(
          ethers.constants.AddressZero,
          account?.address
        );

        console.log(exchangeEtherBalance.toString());

        // const tokenBalance = await tokenContract
        //   .connect(provider)
        //   .balanceOf(account?.address);
        // const exchangeEtherBalance = exchangeContract
        //   .connect(provider)
        //   .balanceOf(ethers.constants.AddressZero, account?.address);
        // console.log(etherBalance, tokenBalance, exchangeEtherBalance);
      } catch (e) {
        console.error("Error: ", e);
      }
    }

    loadBalances();
  }, [provider, state.contracts, state.user]);

  return (
    <Flex flexDirection="column" p="1rem" height="inherit" width="inherit">
      <Box>
        <Text fontSize="xl" style={{ fontWeight: "bold" }}>
          Balance
        </Text>
      </Box>

      <Tabs mt="1rem" overflowX="auto" overflowY="auto">
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
