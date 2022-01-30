# Supply chain & data auditing

This repository containts an Ethereum DApp that demonstrates a Supply Chain flow between a Seller and Buyer. The user story is similar to any commonly used supply chain process. A Seller can add items to the inventory system stored in the blockchain. A Buyer can purchase such items from the inventory system. Additionally a Seller can mark an item as Shipped, and similarly a Buyer can mark an item as Received.

The DApp User Interface when running should look like...

![truffle test](images/ftc_product_overview.png)

![truffle test](images/ftc_farm_details.png)

![truffle test](images/ftc_product_details.png)

![truffle test](images/ftc_transaction_history.png)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Please make sure you've already installed ganache-cli, Truffle and enabled MetaMask extension in your browser.

```
Give examples (to be clarified)
```

### Installing

> The starter code is written for **Solidity v0.4.24**. At the time of writing, the current Truffle v5 comes with Solidity v0.5 that requires function _mutability_ and _visibility_ to be specified (please refer to Solidity [documentation](https://docs.soliditylang.org/en/v0.5.0/050-breaking-changes.html) for more details). To use this starter code, please run `npm i -g truffle@4.1.14` to install Truffle v4 with Solidity v0.4.24.

A step by step series of examples that tell you have to get a development env running

Clone this repository:

```
git clone https://github.com/udacity/nd1309/tree/master/course-5/project-6
```

Change directory to `project-6` folder and install all requisite npm packages (as listed in `package.json`):

```
cd project-6
npm install
```

Launch Ganache:

```
ganache-cli -m "spirit supply whale amount human item harsh scare congress discover talent hamster"
```

Your terminal should look something like this:

![truffle test](images/ganache-cli.png)

In a separate terminal window, Compile smart contracts:

```
truffle compile
```

Your terminal should look something like this:

![truffle test](images/truffle_compile.png)

This will create the smart contract artifacts in folder `build\contracts`.

Migrate smart contracts to the locally running blockchain, ganache-cli:

```
truffle migrate
```

Your terminal should look something like this:

![truffle test](images/truffle_migrate.png)

Test smart contracts:

```
truffle test
```

All 10 tests should pass.

![truffle test](images/truffle_test.png)

In a separate terminal window, launch the DApp:

```
npm run dev
```

## Built With

- [Ethereum](https://www.ethereum.org/) - Ethereum is a decentralized platform that runs smart contracts
- [IPFS](https://ipfs.io/) - IPFS is the Distributed Web | A peer-to-peer hypermedia protocol
  to make the web faster, safer, and more open.
- [Truffle Framework](http://truffleframework.com/) - Truffle is the most popular development framework for Ethereum with a mission to make your life a whole lot easier.

## Authors

See also the list of [contributors](https://github.com/your/project/contributors.md) who participated in this project.

## Acknowledgments

- Solidity
- Ganache-cli
- Truffle
- IPFS

## Deployed rinkeby addresses

```
Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x3ae6c1f6e47813bf8d0cbc4592ed6560144037289f6e5e4f106eb9e3bc7b5f15
  Migrations: 0xb70c94932e241120e45b2cbe06b07d90a100fd89
Saving successful migration to network...
  ... 0x5e26b978e72a5fae70446d310570ce8047d832ecfabeac340a79d36215f0583e
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying FarmerRole...
  ... 0x59cdeac3b8122aa913e379b21a290faf0853ab2744752f6f36605e1bc7886ebd
  FarmerRole: 0xef1f9db294365e856c5bc3241c355d223fcd238c
  Deploying DistributorRole...
  ... 0x45891052f873fa132468dc1d94a834cd61d5c2cd03a7a0dbe062996b9f961065
  DistributorRole: 0x43e1d54e110987eb5302d216a5928a408a084955
  Deploying RetailerRole...
  ... 0x801a962ee65f73ae7ec68dc0a4f228ebca4b0bb84e3c0cb9c2b119196ed1b1e3
  RetailerRole: 0x3c2e561cb7dae649867df6cf380b50a3f2ec9201
  Deploying ConsumerRole...
  ... 0x52063c5d2df64c69e722d25348aa13d0e4240f6f868df0c30015fe1dff21dd83
  ConsumerRole: 0xa402a66637dddeca6992a7c76413932522bb3044
  Deploying SupplyChain...
  ... 0x22a9652818bf69852973bdb298757809bc53bf4766431e1769a12e1345e16aaf
  SupplyChain: 0x9372c0f5d663dfc96d3d2040dd67c6cb6b6b6b2b
Saving successful migration to network...
  ... 0x9f84e471d6c870d5a0467420b4d385c959dcbdef2bb2b0413f512ed3e9aef6ea
Saving artifacts..
```
