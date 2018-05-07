import React, { Component } from 'react';
import factory from '../ethereum/factory';

export default class extends Component {
  async componentDidMount() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    console.log(campaigns);
  }
  render() {
    return <div>campaigns index</div>;
  }
}
