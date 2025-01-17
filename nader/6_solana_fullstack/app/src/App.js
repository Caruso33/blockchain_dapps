import "./App.css"
import { useState } from "react"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"
import * as anchor from "@project-serum/anchor"
import idl from "./idl.json"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets"
import {
  useWallet,
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react"
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui"
import keypair from "./keypair.json"
import "@solana/wallet-adapter-react-ui/styles.css"

const wallets = [
  /* view list of available wallets at https://github.com/solana-labs/wallet-adapter#wallets */
  new PhantomWalletAdapter(),
]

const { Program, AnchorProvider, web3 } = anchor
const { SystemProgram, Keypair } = web3

/* create an account  */
const arr = Object.values(keypair._keypair.secretKey)
const secret = new Uint8Array(arr)
const pair = web3.Keypair.fromSecretKey(secret)
const baseAccount = new Keypair(pair)

// const baseAccount = Keypair.generate()
const opts = {
  preflightCommitment: "processed",
}
const programID = new PublicKey(idl.metadata.address)

function App() {
  const [value, setValue] = useState(null)
  const wallet = useWallet()

  async function getProvider() {
    /* create the provider and return it to the caller */
    /* network set to local network for now */
    const network = "http://127.0.0.1:8899"
    const connection = new Connection(network, opts.preflightCommitment)

    const provider = new AnchorProvider(
      connection,
      wallet,
      opts.preflightCommitment
    )
    return provider
  }

  async function createCounter() {
    const provider = await getProvider()
    /* create the program interface combining the idl, program ID, and provider */
    const program = new Program(idl, programID, provider)
    try {
      /* interact with the program via rpc */
      await program.rpc.create({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount],
      })

      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      )
      console.log("account: ", account)
      setValue(account.count.toString())
    } catch (err) {
      console.log("Transaction error: ", err)
    }
  }

  async function increment() {
    const provider = await getProvider()
    const program = new Program(idl, programID, provider)
    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    })

    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    )
    console.log("account: ", account)
    setValue(account.count.toString())
  }

  if (!wallet.connected) {
    /* If the user's wallet is not connected, display connect wallet button. */
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "100px",
        }}
      >
        <WalletMultiButton />
      </div>
    )
  } else {
    return (
      <div className="App">
        <div>
          {!value && <button onClick={createCounter}>Create counter</button>}

          {value && <button onClick={increment}>Increment counter</button>}

          {value && value >= Number(0) ? (
            <h2>{value}</h2>
          ) : (
            <h3>Please create the counter.</h3>
          )}
        </div>
      </div>
    )
  }
}

const network = "http://127.0.0.1:8899" || clusterApiUrl("devnet") // change for devnet

/* wallet configuration as specified here: https://github.com/solana-labs/wallet-adapter#setup */
const AppWithProvider = () => (
  <ConnectionProvider endpoint={network}>
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
)

export default AppWithProvider
