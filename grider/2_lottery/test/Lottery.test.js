const assert = require("assert")
const ganache = require("ganache-cli")
const Web3 = require("web3")
const provider = ganache.provider()
const web3 = new Web3(provider)
const contracts = require("../compile")

const contractName = "Lottery"
const inboxContract = contracts[contractName]

const { evm, abi } = inboxContract

let accounts
let lottery

beforeEach(async () => {
  // get list of all accounts
  accounts = await web3.eth.getAccounts()

  // use one of those accounts to deploy contract
  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object })
    .send({ from: accounts[0], gas: "1000000" })
})

describe("Lottery", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address)
  })

  it("allows one account to enter", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("0.11", "ether") })

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    })
    assert.equal(accounts[0], players[0])
    assert.equal(1, players.length)
    // parameters: 1) what it should be, 2) what it actually is
  })

  it("allows mulitple accounts to enter", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("0.11", "ether") })
    await lottery.methods
      .enter()
      .send({ from: accounts[1], value: web3.utils.toWei("0.2", "ether") })
    await lottery.methods
      .enter()
      .send({ from: accounts[2], value: web3.utils.toWei("0.3", "ether") })

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    })
    assert.equal(accounts[0], players[0])
    assert.equal(accounts[1], players[1])
    assert.equal(accounts[2], players[2])
    assert.equal(3, players.length)
    // parameters: 1) what it should be, 2) what it actually is
  })

  it("requires a minimum amount of ether to enter", async () => {
    try {
      await lottery.methods.enter().send({ from: accounts[0], value: 200 })
      assert(false) // failing assertion, if we ever come to this line
    } catch (e) {
      assert(e) // asserts that error was thrown
    }
  })
  it("only manager can call pickWinner", async () => {
    try {
      await lottery.methods.pickWinner().send({ from: accounts[1] })
      assert(false)
    } catch (e) {
      assert(e)
    }
  })

  it("sends money to the winner and resets the players array", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("2", "ether") })

    const initialBalance = await web3.eth.getBalance(accounts[0])
    await lottery.methods.pickWinner().send({ from: accounts[0] })
    const finalBalance = await web3.eth.getBalance(accounts[0])
    const difference = finalBalance - initialBalance

    assert(difference > web3.utils.toWei("1.9", "ether"))

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    })
    assert.equal(0, players.length)

    assert.equal(0, await web3.eth.getBalance(lottery.options.address))
  })
})
