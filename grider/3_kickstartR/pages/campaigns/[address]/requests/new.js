import Link from "next/link"
import { withRouter } from "next/router"
import React, { Component } from "react"
import { Button, Form, Input, Message } from "semantic-ui-react"
import Layout from "../../../../components/Layout"
import Campaign from "../../../../ethereum/campaign"
import web3 from "../../../../ethereum/web3"

class RequestNew extends Component {
  state = {
    value: "",
    description: "",
    recipient: "",
    errorMessage: "",
    loading: false,
  }

  onSubmit = async (event) => {
    event.preventDefault()

    const campaign = Campaign(this.props.address)
    const { description, value, recipient } = this.state

    this.setState({ loading: true, errorMessage: "" })

    try {
      const accounts = await web3.eth.requestAccounts()

      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({ from: accounts[0] })

      this.setState({
        loading: false,
        errorMessage: "",
        description: "",
        value: "",
        recipient: "",
      })

      this.props.router.replace(`/campaigns/${this.props.address}/requests`)
      // refresh the page
    } catch (err) {
      this.setState({ loading: false, errorMessage: err.message })
    }
  }

  render() {
    return (
      <Layout>
        <Link href={`/campaigns/${this.props.address}/requests`}>
          <a>Back</a>
        </Link>

        <h3>Create a Request</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={(event) => {
                this.setState({ description: event.target.value })
              }}
            />
          </Form.Field>

          <Form.Field>
            <label>Value in Ether</label>
            <Input
              value={this.state.value}
              onChange={(event) => {
                this.setState({ value: event.target.value })
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Recipient</label>
            <Input
              value={this.state.recipient}
              onChange={(event) => {
                this.setState({ recipient: event.target.value })
              }}
            />
          </Form.Field>

          <Button primary loading={this.state.loading}>
            Create!
          </Button>

          <Message
            error
            header="Oops!"
            content={this.state.errorMessage}
            style={{ overflowWrap: "break-word" }}
          />
        </Form>
      </Layout>
    )
  }
}

export default withRouter(RequestNew)

export async function getServerSideProps(props) {
  const { address } = props.query

  return { props: { address } }
}
