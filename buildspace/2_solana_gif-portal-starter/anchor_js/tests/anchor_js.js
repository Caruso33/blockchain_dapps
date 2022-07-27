const anchor = require("@project-serum/anchor")

// Need the system program, will talk about this soon.
const { SystemProgram } = anchor.web3

describe("anchor_js", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  it("Is initialized!", async () => {
    console.log("🚀 Starting test...")

    // Add your test here.
    const program = anchor.workspace.AnchorJs

    // Create an account keypair for our program to use.
    const baseAccount = anchor.web3.Keypair.generate()

    // Call start_stuff_off, pass it the params it needs!
    let tx = await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    })

    // const tx = await program.methods.initialize().rpc()
    console.log("📝 Your transaction signature", tx)

    // Fetch data from the account.
    let account = await program.account.baseAccount.fetch(baseAccount.publicKey)
    console.log("👀 GIF Count", account.totalGifs.toString())

    await program.rpc.addGif("https://i.giphy.com/media/krkrHAEodHgzP72rTI/giphy.webp", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    })

    // Get the account again to see what changed.
    account = await program.account.baseAccount.fetch(baseAccount.publicKey)
    console.log("👀 GIF Count", account.totalGifs.toString())
    // Access gif_list on the account!
    console.log("👀 GIF List", account.gifList)
  })
})
