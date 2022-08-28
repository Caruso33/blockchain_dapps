### Deployment

```shell
$ /Users/tobias/Code/blockchain_dapps/near/dacade_near_101/node_modules/.bin/near deploy --accountId=subacc1.caruso33.testnet --wasmFile ./build/release/dacade_near_101.wasm
Starting deployment. Account id: subacc1.caruso33.testnet, node: https://rpc.testnet.near.org, helper: https://helper.testnet.near.org, file: ./build/release/dacade_near_101.wasm
Transaction Id 2k5aqhq46L2hYBDPJhEsvL6hMXTNEaGYSnoN7AbUDwrY
To see the transaction in the transaction explorer, please open this url in your browser
https://explorer.testnet.near.org/transactions/2k5aqhq46L2hYBDPJhEsvL6hMXTNEaGYSnoN7AbUDwrY
Done deploying to subacc1.caruso33.testnet
✨  Done in 14.68s.
```

### Calling

```shell
$ /Users/tobias/Code/blockchain_dapps/near/dacade_near_101/node_modules/.bin/near call subacc1.caruso33.testnet setProduct '{"id": "0", "productName": "tea"}' --accountId=caruso33.testnet
Scheduling a call: subacc1.caruso33.testnet.setProduct({"id": "0", "productName": "tea"})
Doing account.functionCall()
Transaction Id 3KnLZFxaqEy7pzvmjApJDVGSaDhT3q5cM9zdKqXpH28Y
To see the transaction in the transaction explorer, please open this url in your browser
https://explorer.testnet.near.org/transactions/3KnLZFxaqEy7pzvmjApJDVGSaDhT3q5cM9zdKqXpH28Y
''
✨  Done in 5.71s.
```

### Viewing

```shell
❯ yarn near view subacc1.caruso33.testnet getProduct '{"id": "0"}'
yarn run v1.22.15
$ /Users/tobias/Code/blockchain_dapps/near/dacade_near_101/node_modules/.bin/near view subacc1.caruso33.testnet getProduct '{"id": "0"}'
View call: subacc1.caruso33.testnet.getProduct({"id": "0"})
'tea'
✨  Done in 1.55s.
```
