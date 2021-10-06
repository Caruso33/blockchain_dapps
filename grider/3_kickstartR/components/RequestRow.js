import { withRouter } from "next/router"
import React, { Component } from "react"
import { Button, Table } from "semantic-ui-react"
import getCampaign from "../ethereum/campaign"
import web3 from "../ethereum/web3"

class RequestRow extends Component {
  state = { campaign: getCampaign(this.props.address) }

  async getAccounts() {
    const accounts = await web3.eth.requestAccounts()
    return accounts
  }

  onApprove = async () => {
    const { campaign } = this.state

    this.props.setError("")

    try {
      const accounts = await this.getAccounts()

      await campaign.methods
        .approveRequest(this.props.id)
        .send({ from: accounts[0] })

      this.props.router.replace(`/campaigns/${this.props.address}/requests`)
    } catch (error) {
      console.error(error)

      this.props.setError(error.message)
    }
  }

  onFinalize = async () => {
    const { campaign } = this.state

    this.props.setError("")

    try {
      const accounts = await this.getAccounts()

      await campaign.methods
        .finalizeRequest(this.props.id)
        .send({ from: accounts[0] })

      this.props.router.replace(`/campaigns/${this.props.address}/requests`)
    } catch (error) {
      console.error(error)

      this.props.setError(error.message)
    }
  }

  render() {
    const { id, approversCount, request } = this.props

    const { description, value, recipient, approvalsCount, complete } = request

    const { Row, Cell } = Table
    const readyToFinalize = approvalsCount > approversCount / 2

    return (
      <Row disabled={complete} positive={readyToFinalize && !complete}>
        <Cell>{id}</Cell>
        <Cell>{description}</Cell>
        <Cell>{web3.utils.fromWei(value, "ether")}</Cell>
        <Cell>{recipient}</Cell>
        <Cell>
          {approvalsCount}/{approversCount}
        </Cell>
        <Cell>
          {complete ? null : (
            <Button color="green" basic onClick={this.onApprove}>
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {complete ? null : (
            <Button
              color="teal"
              basic
              onClick={this.onFinalize}
              disabled={!readyToFinalize}
            >
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    )
  }
}

export default withRouter(RequestRow)
