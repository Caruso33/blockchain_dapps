import { Flex, Box, Button, Text, Code } from "@chakra-ui/react";
import React from "react";
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import useMounted from "../../hooks/useMounted";

const Navbar: React.FC = () => {
  return (
    <Flex justifyContent="space-between" alignItems="center" h="100%" mx="1rem">
      <Box>
        <Text>Dapp Exchange</Text>
      </Box>

      <Flex
        justifyContent="space-between"
        alignItems="center"
        h="100%"
        mx="1rem"
      >
        <Wallet />
      </Flex>
    </Flex>
  );
};

function Wallet() {
  const { data } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { activeChain } = useNetwork();
  const mounted = useMounted();

  if (mounted && data)
    return (
      <>
        <Text>Connected to</Text>
        <Code>{data.address}</Code>
        <Text ml="0.5rem">on {activeChain?.name}</Text>
        <Button ml="0.5rem" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </>
    );

  return <Button onClick={() => connect()}>Connect Wallet</Button>;
}

export default Navbar;
