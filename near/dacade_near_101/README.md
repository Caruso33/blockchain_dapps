## 1st Version

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

## 2nd Version

### Deployment

```shell
❯ yarn near deploy --accountId=subacc1.caruso33.testnet --wasmFile ./build/release/dacade_near_101.wasm
yarn run v1.22.15
$ /Users/tobias/Code/blockchain_dapps/near/dacade_near_101/node_modules/.bin/near deploy --accountId=subacc1.caruso33.testnet --wasmFile ./build/release/dacade_near_101.wasm
This account already has a deployed contract [ 78smdgdxUCVgbHML9GT35NWxbW1VhUUYHiWGRcqzzncJ ]. Do you want to proceed? (y/n) y
Starting deployment. Account id: subacc1.caruso33.testnet, node: https://rpc.testnet.near.org, helper: https://helper.testnet.near.org, file: ./build/release/dacade_near_101.wasm
Transaction Id 2XRZqFg7guTrNHahpMnCG7YEw7YDXNGitFJUY6byL4Mk
To see the transaction in the transaction explorer, please open this url in your browser
https://explorer.testnet.near.org/transactions/2XRZqFg7guTrNHahpMnCG7YEw7YDXNGitFJUY6byL4Mk
Done deploying to subacc1.caruso33.testnet
✨  Done in 29.34s.
```

### Calling

```shell
❯ yarn near call subacc1.caruso33.testnet setProduct '{"product": {"id": "0", "name": "BBQ", "description": "Grilled chicken and beef served with vegetables and chips.", "location": "Berlin, Germany", "price": "1000000000000000000000000", "image": "https://i.imgur.com/yPreV19.png"}}' --accountId=caruso33.testnet
yarn run v1.22.15
$ /Users/tobias/Code/blockchain_dapps/near/dacade_near_101/node_modules/.bin/near call subacc1.caruso33.testnet setProduct '{"product": {"id": "0", "name": "BBQ", "description": "Grilled chicken and beef served with vegetables and chips.", "location": "Berlin, Germany", "price": "1000000000000000000000000", "image": "https://i.imgur.com/yPreV19.png"}}' --accountId=caruso33.testnet
Scheduling a call: subacc1.caruso33.testnet.setProduct({"product": {"id": "0", "name": "BBQ", "description": "Grilled chicken and beef served with vegetables and chips.", "location": "Berlin, Germany", "price": "1000000000000000000000000", "image": "https://i.imgur.com/yPreV19.png"}})
Doing account.functionCall()
Transaction Id CcuQrjZdY6KhvcSshzuJTtTQhq9UDNH5Zfaf2ZTEmyT1
To see the transaction in the transaction explorer, please open this url in your browser
https://explorer.testnet.near.org/transactions/CcuQrjZdY6KhvcSshzuJTtTQhq9UDNH5Zfaf2ZTEmyT1
''
✨  Done in 6.57s.
```

### Viewing

```shell
❯ yarn near view subacc1.caruso33.testnet getProduct '{"id": "0"}'
yarn run v1.22.15
$ /Users/tobias/Code/blockchain_dapps/near/dacade_near_101/node_modules/.bin/near view subacc1.caruso33.testnet getProduct '{"id": "0"}'
View call: subacc1.caruso33.testnet.getProduct({"id": "0"})
{
    id: '0',
    name: 'BBQ',
    description: 'Grilled chicken and beef served with vegetables and chips.',
    image: 'https://i.imgur.com/yPreV19.png',
    location: 'Berlin, Germany',
    price: '1000000000000000000000000',
    owner: 'caruso33.testnet',
    sold: 0
}
✨ Done in 1.80s.
```
