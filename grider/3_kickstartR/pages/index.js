import React, { Component, Fragment } from "react"
import getFactory from "../ethereum/factory"
import Layout from "../components/Layout"
import { Card, Button } from "semantic-ui-react"
import Link from "next/link"

class Index extends Component {
  renderCampaigns = () => {
    const items = this.props.campaigns.map((address) => ({
      header: address,
      description: (
        <Link href={`/campaigns/${address}`}>
          <a>View Campaign</a>
        </Link>
      ),
      fluid: true,
    }))

    return <Card.Group items={items} style={{ lineBreak: "anywhere" }} />
  }

  render() {
    return (
      <Layout>
        <Fragment>
          <h3>Open Campaigns</h3>

          <Link href="/campaigns/new">
            <a>
              <Button
                floated="right"
                content="Create Campaign"
                icon="add"
                primary
              />
            </a>
          </Link>

          {this.renderCampaigns()}
        </Fragment>
      </Layout>
    )
  }
}

export default Index

export async function getServerSideProps() {
  const address = process.env.NEXT_PUBLIC_FACTORY_ADDRESS

  const factory = getFactory(address)

  // method is nextjs specific
  // because componentDidMount is not called in server-side rendering
  const campaigns = await factory.methods.getDeployedCampaigns().call()

  return { props: { campaigns } } // is provided as props
}
