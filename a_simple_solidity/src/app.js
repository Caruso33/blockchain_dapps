App = {
  contracts: {},
  loading: false,

  load: async () => {
    console.log("app loading...")

    App.setLoading(true)
    App.loadWeb3()
      .then(App.loadAccount)
      .then(App.loadContract)
      .then(() => App.setLoading(false))
      .then(App.render)
      .catch((e) => console.error("An error occured", e))
  },
  loadWeb3: async () => {
    if (window.ethereum) {
      console.log("modern dapp browser detected.")

      try {
        // get permission to use metamask account
        await ethereum.enable()
        // alternative
        // ethereum.request({ method: "eth_requestAccounts" })
      } catch {
        console.log("no access to account allowed, stopping here")
      }
      App.provider = ethereum
      window.web3 = new Web3(ethereum)
    } else if (window.web3) {
      console.log("legacy dapp browser detected")
      App.provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
    } else {
      // Non-dapp browsers...
      throw Error(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      )
    }
  },
  loadAccount: async () => {
    App.accounts = await App.provider.request({ method: "eth_accounts" })

    if (!App.accounts)
      throw Error("No Account found! Check Metamask connection.")

    const weiBalance = await App.provider.request({
      method: "eth_getBalance",
      params: [App.accounts[0], "latest"],
    })
    const etherBalance = web3.utils.fromWei(weiBalance, "ether")

    // alternative way with web3 utility instead of request and callback instead of promise
    // web3.eth.getBalance(App.accounts[0], (err, wei) => {
    //   balance = web3.utils.fromWei(wei, "ether")
    //   console.log("Balance of accounts[0]: " + balance) // works as expected
    // })

    console.log(`Account ${App.accounts[0]}\nBalance ${etherBalance}`)
  },
  loadContract: async () => {
    const todoList = await $.getJSON("TodoList.json")

    // the loaded abi
    App.contracts.TodoList = TruffleContract(todoList)
    App.contracts.TodoList.setProvider(App.provider)
    // smart contract with values from the blockchain
    App.todoList = await App.contracts.TodoList.deployed()
  },

  render: async () => {
    if (App.loading) return

    $("#account").html(App.accounts[0])

    await App.renderTasks()
  },

  renderTasks: async () => {
    // load total task count from the blockchain
    const taskCount = await App.todoList.taskCount()
    const $taskTemplate = $(".taskTemplate")

    // render out each task with a new task template
    for (let i = 1; i <= taskCount; i++) {
      const task = await App.todoList.tasks(i)

      const {
        id: taskIdBN,
        content: taskContent,
        completed: taskCompleted,
      } = task

      const taskId = taskIdBN.toNumber()

      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find(".content").html(taskContent)
      $newTaskTemplate
        .find("input")
        .prop("name", taskId)
        .prop("checked", taskCompleted)
        .prop("click", App.toggleCompleted)

      // put task in correct list
      if (taskCompleted) {
        $("#completedTaskList").append($newTaskTemplate)
      } else {
        $("#taskList").append($newTaskTemplate)
      }

      // show task
      $newTaskTemplate.show()
    }
  },

  toggleCompleted: async () => {},
  setLoading: (isLoading) => {
    App.loading = isLoading
    const loader = $("#loader")
    const content = $("#content")

    if (isLoading) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  },
}

// window.onload = () => {
//     App.load()
// }

// $(window).load(() => {
//   App.load();
// });

$(() => {
  App.load()
})
