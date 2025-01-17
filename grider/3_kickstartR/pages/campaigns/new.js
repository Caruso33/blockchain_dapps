import { withRouter } from "next/router"
import React, { Component } from "react"
import { Button, Form, Input, Message } from "semantic-ui-react"
import Layout from "../../components/Layout"
import getFactory from "../../ethereum/factory"
import web3 from "../../ethereum/web3"

class CampaignNew extends Component {
  state = { minimumContribution: "", errorMessage: "", loading: false }

  factory = getFactory(process.env.NEXT_PUBLIC_FACTORY_ADDRESS)

  onSubmit = async (event) => {
    event.preventDefault()

    this.setState({ loading: true, errorMessage: "" })

    try {
      const accounts = await web3.eth.requestAccounts()

      await this.factory.methods
        .createCampaign(this.state.minimumContribution)
        // metamask will guess the amount of gas needed
        // and will apply it to the send, so no need to do it yourself
        .send({ from: accounts[0] })

      this.props.router.push("/")
    } catch (e) {
      console.error(e)

      this.setState({ errorMessage: e.message })
    }

    this.setState({
      loading: false,
    })
  }

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>

        {/* error="" is falsy and won't displayed */}
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              labelPosition="right"
              label="wei"
              value={this.state.minimumContribution}
              onChange={(event) =>
                this.setState({
                  minimumContribution: event.target.value,
                })
              }
              type="number"
            />
          </Form.Field>

          <Button loading={this.state.loading} primary>
            Create!
          </Button>

          <Message
            size="mini"
            error
            header="Oops!"
            content={this.state.errorMessage}
          />
        </Form>
      </Layout>
    )
  }
}

export default withRouter(CampaignNew)
