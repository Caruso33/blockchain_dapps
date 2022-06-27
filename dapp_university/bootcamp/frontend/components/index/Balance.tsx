import {
  Box,
  Button,
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
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
} from "@chakra-ui/react"
import { ethers } from "ethers"
import React, { useState } from "react"
import { useSigner } from "wagmi"
import useLoadBalances from "../../hooks/useLoadBalances"
import useAppState from "../../state"

const Balance: React.FC = () => {
  const [state] = useAppState()

  const [deposit, setDeposit] = useState({ ethAmount: 0.0, tokenAmount: 0 })
  const [isLoading, setIsLoading] = useState(false)

  const { data: signer } = useSigner()

  useLoadBalances()

  const depositEth = async () => {
    setIsLoading(true)

    const exchange = state.contracts?.exchangeContract

    try {
      await exchange.connect(signer).depositEther({ value: deposit.ethAmount })
    } finally {
      setIsLoading(false)
    }
  }
  const depositToken = async () => {
    setIsLoading(true)

    const tokenContract = state.contracts?.tokenContract
    const exchangeContract = state.contracts?.exchangeContract

    try {
      await tokenContract
        .connect(signer)
        .approve(exchangeContract.address, deposit.tokenAmount)
      await exchangeContract
        .connect(signer)
        .depositToken(
          state.contracts?.tokenContract?.address,
          deposit.tokenAmount
        )
    } finally {
      setIsLoading(false)
    }
  }

  const { ether, token, exchangeEther, exchangeToken } = state?.user?.balances

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
                      {Number(exchangeEther?.toString() || "0").toFixed(3)}
                    </Td>
                    <Td isNumeric>Exchange</Td>
                  </Tr>

                  <Tr>
                    <Td>TOKEN</Td>
                    <Td isNumeric>
                      {Number(exchangeToken?.toString() || "0").toFixed(3)}
                    </Td>
                    <Td isNumeric>Exchange</Td>
                  </Tr>

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
                    <Td>TOKEN</Td>
                    <Td isNumeric>
                      {Number(
                        ethers.utils.formatUnits(token?.toString() || "0")
                      ).toFixed(3)}
                    </Td>
                    <Td isNumeric>Origin</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel>
            <p>Add me!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Flex direction="column" fontSize="sm" mt="0.5rem">
        <Flex>
          <NumberInput
            placeholder="Eth Amount"
            value={deposit.ethAmount}
            onChange={(value: string) =>
              setDeposit({ ...deposit, ethAmount: Number(value) })
            }
            defaultValue={0.0}
            min={0.0}
            max={Number(ethers.utils.formatEther(ether || "0"))}
            step={0.01}
            maxW={150}
            mr="0.5rem"
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <Slider
            flex="1"
            focusThumbOnChange={false}
            value={deposit.ethAmount}
            onChange={(value: number) =>
              setDeposit({ ...deposit, ethAmount: value })
            }
            max={Number(ethers.utils.formatEther(ether || "0"))}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>

          <Button ml="0.5rem" onClick={() => depositEth()} disabled={isLoading}>
            {isLoading ? <Spinner /> : "Deposit"}
          </Button>
        </Flex>

        <Box mt="0.5rem">Dapp Balance</Box>

        <Flex mt="0.5rem">
          <NumberInput
            placeholder="Token Amount"
            value={deposit.tokenAmount}
            onChange={(value: string) =>
              setDeposit({ ...deposit, tokenAmount: Number(value) })
            }
            defaultValue={0}
            min={0}
            max={token}
            step={1}
            maxW={150}
            mr="0.5rem"
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

          <Slider
            flex="1"
            focusThumbOnChange={false}
            value={deposit.tokenAmount}
            onChange={(value: number) =>
              setDeposit({ ...deposit, tokenAmount: value })
            }
            max={token}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>

          <Button
            ml="0.5rem"
            onClick={() => depositToken()}
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Deposit"}
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Balance
