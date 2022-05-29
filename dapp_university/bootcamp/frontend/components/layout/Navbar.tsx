import { Box, Button, Code, Flex, Text, Link } from "@chakra-ui/react";
import React from "react";
import { useConnect, useDisconnect, useNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import useAppState from "../../state";

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
  const [state, dispatch] = useAppState();

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();

  if (state.user?.account?.address) {
    const userNetwork = state?.user?.chain?.name;
    const isMainnet = userNetwork === "Ethereum";

    const subNets = ["Ropsten", "Kovan", "Rinkeby", "Goerli"];
    const isSubnet = subNets.includes(userNetwork);

    const href =
      isMainnet || isSubnet
        ? `https://${isSubnet && `${userNetwork}.`}etherscan.io/address/${
            state.user?.account?.address
          }`
        : "";

    return (
      <>
        <Text>Connected to</Text>
        <Link href={href}>
          <Code>{state.user?.account?.address}</Code>
        </Link>

        <Text ml="0.5rem">on {state.user?.chain?.name}</Text>

        <Button ml="0.5rem" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </>
    );
  }

  return <Button onClick={() => connect()}>Connect Wallet</Button>;
}

export default Navbar;
