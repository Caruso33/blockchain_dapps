import Link from "next/link"
import React, { Component } from "react"
import { Button, Card, Grid } from "semantic-ui-react"
import ContributeForm from "../../../components/ContributeForm"
import Layout from "../../../components/Layout"
import getCampaign from "../../../ethereum/campaign"
import web3 from "../../../ethereum/web3"

class CampaignShow extends Component {
  // not part of actual component instance
  // so address has to be returned because no access
  // in actual component

  renderCards = () => {
    const {
      balance,
      manager,
      minimumContribution,
      requestCount,
      approversCount,
    } = this.props

    const items = [
      {
        header: manager,
        meta: "Address of manager",
        description:
          "The manager created this campaign and can create requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (wei)",
        description:
          "You must contribute at least this much wei to become an approver",
      },
      {
        header: requestCount,
        meta: "Number of Requests",
        description:
          "A request tries to withdraw money from the contract. Request must be approved by approvers.",
      },
      {
        header: approversCount,
        meta: "Number of people who have already donated to this campaign",
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (ether)",
        description:
          "The balance is how much money this campaign has left to spend",
      },
    ]

    return <Card.Group items={items} />
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Details</h3>

        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()} </Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link href={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    )
  }
}

export default CampaignShow

export async function getServerSideProps(props) {
  const campaign = getCampaign(props.query.address)

  let summary

  try {
    summary = await campaign.methods.getSummary().call()

    return {
      props: {
        address: props.query.address,
        minimumContribution: summary[0],
        balance: summary[1],
        requestCount: summary[2],
        approversCount: summary[3],
        manager: summary[4],
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
