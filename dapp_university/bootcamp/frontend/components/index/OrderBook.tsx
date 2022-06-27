import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tooltip,
  Tr,
} from "@chakra-ui/react"
import React, { useState } from "react"
import { useSigner } from "wagmi"
import useAppState from "../../state"
import { eventTypes } from "../../state/reducers/events"
import useMakeOrderEvents, {
  MakeOrderEventEnhanced,
} from "./trades/useMakeOrderEvents"

const OrderBook: React.FC = () => {
  const [, buyOrders, sellOrders] = useMakeOrderEvents()
  const [isTrading, setIsTrading] = useState<boolean>(false)

  const { data: signer } = useSigner()

  const [state, dispatch] = useAppState()
  console.dir(state.events.trades)
  const onBuyOrder = async (order: MakeOrderEventEnhanced) => {
    if (isTrading) return

    const exchange = state.contracts?.exchangeContract

    setIsTrading(true)

    try {
      const tradeEvents = [
        {
          amountGet: order.amountGet,
          amountGive: order.amountGive,
          id: order.id,
          user: order.user,
          timestamp: order.timestamp,
          tokenGet: order.tokenGet,
          tokenGive: order.tokenGive,
          trader: signer?.getAddress(),
        },
      ]

      await exchange.connect(signer).fillOrder(order.id.toNumber())
      dispatch({ type: eventTypes.ADD_TRADES, data: tradeEvents })
    } finally {
      setIsTrading(false)
    }
  }

  const onSellOrder = async (order: MakeOrderEventEnhanced) => {
    if (isTrading) return

    const exchange = state.contracts?.exchangeContract

    setIsTrading(true)

    try {
      const tradeEvents = [
        {
          amountGet: order.amountGet,
          amountGive: order.amountGive,
          id: order.id,
          user: order.user,
          timestamp: order.timestamp,
          tokenGet: order.tokenGet,
          tokenGive: order.tokenGive,
          trader: signer?.getAddress(),
        },
      ]
      await exchange.connect(signer).fillOrder(order.id.toNumber())
      dispatch({ type: eventTypes.ADD_TRADES, data: tradeEvents })
    } finally {
      setIsTrading(false)
    }
  }

  return (
    <Flex flexDirection="column" p="1rem" height="100%">
      <Text fontSize="xl" style={{ fontWeight: "bold" }}>
        OrderBook
      </Text>

      <TableContainer overflowX="auto" overflowY="auto" mt="1rem">
        <Table variant="simple" fontSize="sm">
          <Tbody>
            {buyOrders.map((order: MakeOrderEventEnhanced, index: number) => (
              <Tooltip label="Click to Sell" key={"bid" + index}>
                <Tr onClick={() => onSellOrder(order)}>
                  <Td isNumeric>{order.tokenAmount.toNumber()}</Td>
                  <Td isNumeric color="green.200">
                    {order.tokenPrice}
                  </Td>
                  <Td isNumeric>{order.etherAmount.toNumber()}</Td>
                </Tr>
              </Tooltip>
            ))}

            <Tr>
              <Td>TOKEN</Td>
              <Td>TOKEN/ETH</Td>
              <Td>ETH</Td>
            </Tr>

            {sellOrders
              .reverse()
              .map((order: MakeOrderEventEnhanced, index: number) => (
                <Tooltip label="Click to Buy" key={"ask" + index}>
                  <Tr onClick={() => onBuyOrder(order)}>
                    <Td isNumeric>{order.tokenAmount.toNumber()}</Td>
                    <Td isNumeric color="red.200">
                      {order.tokenPrice}
                    </Td>
                    <Td isNumeric>{order.etherAmount.toNumber()}</Td>
                  </Tr>
                </Tooltip>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  )
}

export default OrderBook
