import { Flex, Box } from "@chakra-ui/react";
import React from "react";

const Navbar: React.FC = () => {
  return (
    <Flex justifyContent="space-between" alignItems="center" h="100%" mx="1rem">
      <Box>Dapp Exchange</Box>

      <Box>Wallet Address</Box>
    </Flex>
  );
};

export default Navbar;
