import Link from "next/link"
import React, { Component } from "react"
import { Button, Icon, Message, Table } from "semantic-ui-react"
import Layout from "../../../../components/Layout"
import RequestRow from "../../../../components/RequestRow"
import getCampaign from "../../../../ethereum/campaign"

class RequestIndex extends Component {
  state = { errorMessage: "" }

  setError = (errorMessage) => {
    this.setState({ errorMessage })
  }

  renderRow = () => {
    return this.props.requests.map((request, index) => (
      <RequestRow
        key={index}
        id={index}
        request={request}
        address={this.props.address}
        approversCount={this.props.approversCount}
        setError={this.setError}
      />
    ))
  }

  render() {
    const { address, requestCount } = this.props
    const { Header, Row, HeaderCell, Body } = Table

    return (
      <Layout>
        <Link href={`/campaigns/${this.props.address}`}>
          <a>Back</a>
        </Link>

        <h3>Requests</h3>

        <Link href={`/campaigns/${address}/requests/new`}>
          <a>
            <Button primary floated="right" style={{ marginBottom: 10 }}>
              <Icon name="add circle" />
              Add Request
            </Button>
          </a>
        </Link>

        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>

          <Body>{this.renderRow()}</Body>
        </Table>

        {this.state.errorMessage && (
          <Message
            size="mini"
            error
            header="Oops!"
            content={this.state.errorMessage}
            style={{ lineBreak: "anywhere" }}
          />
        )}

        <div>Found {requestCount} request(s).</div>
      </Layout>
    )
  }
}

export default RequestIndex

export async function getServerSideProps(props) {
  const { address } = props.query
  const campaign = getCampaign(address)

  try {
    const [requestCount, approversCount] = await Promise.all([
      campaign.methods.requestsCount().call(),
      campaign.methods.approversCount().call(),
    ])

    const reqs = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((_, index) => campaign.methods.requests(index).call())
    )

    const requests = []

    for (const req of reqs) {
      requests.push({
        description: req.description,
        value: req.value,
        recipient: req.recipient,
        complete: req.complete,
        approvalsCount: req.approvalsCount,
      })
    }

    return {
      props: {
        address,
        requests,
        requestCount,
        approversCount,
      },
    }
  } catch (error) {
    console.error(error)

    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      props: {},
    }
  }
}
