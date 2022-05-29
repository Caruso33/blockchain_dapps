import { Box, Button, Code, Flex, Text, Link } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import useMounted from "../../hooks/useMounted";
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
  const { data } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { activeChain } = useNetwork();
  const mounted = useMounted();

  const [state, dispatch] = useAppState();

  useEffect(() => {
    const handleWalletData = (value: object) => {
      dispatch({ type: "WALLET_ADDRESS", data: value });
    };

    if (data && !state.user?.address) {
      handleWalletData(data);
    }
  }, [data, state, dispatch]);

  if (mounted && data) {
    const isMainnet = activeChain?.name === "Ethereum";

    const subNets = ["Ropsten", "Kovan", "Rinkeby", "Goerli"];
    const isSubnet = subNets.includes(activeChain?.name);

    const href =
      isMainnet || isSubnet
        ? `https://${isSubnet && `${activeChain?.name}.`}etherscan.io/address/${
            data.address
          }`
        : "";

    return (
      <>
        <Text>Connected to</Text>
        <Link href={href}>
          <Code>{data.address}</Code>
        </Link>

        <Text ml="0.5rem">on {activeChain?.name}</Text>

        <Button ml="0.5rem" onClick={() => disconnect()}>
          Disconnect
        </Button>
      </>
    );
  }

  return <Button onClick={() => connect()}>Connect Wallet</Button>;
}

export default Navbar;
