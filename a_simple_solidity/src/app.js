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
      App.provider = ethereum
    } else if (window.web3) {
      console.log("legacy dapp browser detected")
      App.provider = web3.currentProvider
    } else {
      // Non-dapp browsers...
      throw Error(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      )
    }
  },
  loadAccount: async () => {
    App.accounts = await ethereum.request({ method: "eth_accounts" })
    console.log("Account", App.accounts[0])
  },
  loadContract: async () => {
    const todoList = await $.getJSON("TodoList.json")
    // the loaded abi
    App.contracts.TodoList = TruffleContract(todoList)
    App.contracts.TodoList.setProvider(App.provider)
    // smart contract with values from the blockchain
    App.todoList = App.contracts.TodoList.deployed()
  },

  render: async () => {
    console.log(App.loading)
    if (App.loading) return

    $("#account").html(App.accounts[0])
    console.log("here")
    await App.renderTasks()
  },

  renderTasks: async () => {
    // load total task count from the blockchain
    console.log('App.todoList',await App.todoList)
    const taskCount = await App.todoList.taskCount()
    console.log("taskCount", taskCount)
    const $taskTemplate = $(".taskTemplate")

    // render out each task with a new task template
    for (let i = 1; i <= taskCount; i++) {
      const task = await App.todoList.tasks(i)
      const [taskIdBigInt, taskContent, taskCompleted] = task
      const taskId = taskIdBigInt.toNumber()

      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find(".content").html(taskContent)
      $newTaskTemplate
        .find("input")
        .prop("name", taskId)
        .prop("checked", taskCompleted)
        .prop("click", App.toggleCompleted)
    }

    // put task in correct list
    if (taskCompleted) {
      $("#completedTaskList").append($newTaskTemplate)
    } else {
      $("#taskList").append($newTaskTemplate)
    }

    // show task
    $newTaskTemplate.show()
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
