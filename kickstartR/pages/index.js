import React, { Component, Fragment } from 'react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Card, Button } from 'semantic-ui-react';
import { Link } from '../routes';

export default class extends Component {
  static async getInitialProps() {
    // method is nextjs specific
    // because componentDidMount is not called in server-side rendering
    const campaigns = await factory.methods.getDeployedCampaigns().call();

    return { campaigns }; // is provided as props
  }

  renderCampaigns = () => {
    const items = this.props.campaigns.map(address => ({
      header: address,
      description: (
        <Link route={`/campaigns/${address}`}>
          <a>View Campaign</a>
        </Link>
      ),
      fluid: true
    }));

    return <Card.Group items={items} />;
  };
  render() {
    return (
      <Layout>
        <Fragment>
          <h3>Open Campaigns</h3>

          <Link route="/campaigns/new">
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
    );
  }
}
