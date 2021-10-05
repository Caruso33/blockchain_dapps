import { withRouter } from "next/router"
import React, { Component } from "react"
import { Button, Form, Icon, Input, Message } from "semantic-ui-react"
import Campaign from "../ethereum/campaign"
import web3 from "../ethereum/web3"

class ContributeForm extends Component {
  state = { value: "", errorMessage: "", loading: false }

  onSubmit = async (event) => {
    event.preventDefault()

    const campaign = Campaign(this.props.address)

    this.setState({ loading: true, errorMessage: "" })

    try {
      const accounts = await web3.eth.requestAccounts()

      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "wei"),
      })
    } catch (err) {
      this.setState({ errorMessage: err.message })
    }

    this.setState({ loading: false, value: "" })

    // refresh the page
    this.props.router.replace(`/campaigns/${this.props.address}`)
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>

          <Input
            value={this.state.value}
            onChange={(event) => this.setState({ value: event.target.value })}
            label="wei"
            labelPosition="right"
            type="number"
          />
        </Form.Field>

        <Button primary loading={this.state.loading}>
          <Icon name="add circle" />
          Contribute!
        </Button>

        <Message
          error
          header="Oops!"
          content={this.state.errorMessage}
          style={{ overflowWrap: "break-word" }}
        />
      </Form>
    )
  }
}

export default withRouter(ContributeForm)
