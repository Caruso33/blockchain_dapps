const { Block, Blockchain } = require("./models.js")

const blockchain = new Blockchain()
// Add a new block
blockchain.addBlock(
  new Block(Date.now().toString(), { from: "Alice", to: "Bob", amount: 100 })
)
// (This is just a fun example, real cryptocurrencies often have some more steps to implement).

// Prints out the updated chain
console.log(blockchain.chain)

// Block is a class for creating blocks.
// Blockchain is the blockchain class, which means you can inherit this class and upgrade JeChain if you want.
// blockchain is a "Blockchain" object, which is ready to use.

// blockchain.chain // The whole chain
// blockchain.difficulty // The difficulty
// blockchain.getLastBlock() // The latest block
// blockchain.isValid() // "true" if chain is valid, "false" otherwise.
// new Block(timestamp /*string - "optional"*/, data /*array - "optional"*/) // Creates a new "Block" object.
// blockchain.addBlock(block) // Mines the block and add the block to the chain.
