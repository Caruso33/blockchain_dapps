import React from "react";
import { Flex, Text } from "@chakra-ui/react";

const MyTransactions: React.FC = () => {
  return (
    <Flex m="1rem">
      <Text fontSize="xl" style={{ fontWeight: "bold" }}>
        MyTransactions
      </Text>
    </Flex>
  );
};

export default MyTransactions;
