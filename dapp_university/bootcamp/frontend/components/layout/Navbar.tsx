import { Flex, Box, Button, Text, Code } from "@chakra-ui/react";
import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

const Navbar: React.FC = () => {
  return (
    <Flex justifyContent="space-between" alignItems="center" h="100%" mx="1rem">
      <Box>Dapp Exchange</Box>

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

export default Navbar;

function Wallet() {
  const { data } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  if (data)
    return (
      <>
        <Text>
          Connected to <Code>{data.address}</Code>
        </Text>

        <Button ml="0.5rem" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </>
    );
  return <Button onClick={() => connect()}>Connect Wallet</Button>;
}
