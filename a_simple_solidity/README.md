# Info

following along [Build your first blockchain app using ethereum smart contracts and solidity](https://www.youtube.com/watch?v=coQ5dg8wM2o)

## Cmd Notes

### start

`npx truffle init project_name`

`npx truffle create contract YourContractName`

`npx truffle test YourContractName`

### compile & deploy

`npx truffle compile`

`npx truffle migrate # --network development #--reset`

`npx truffle console` # npx truffle develop is only for testing without specific accounts!

```
 todoList = await TodoList.deployed()
 todoList
 todoList.address

 taskCount = await todoList.taskCount()
 taskCount.toNumber()
```
