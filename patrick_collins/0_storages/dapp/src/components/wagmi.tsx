// import { providers } from "ethers";
import {
  chain,
  configureChains,
  createClient,
  defaultChains,
  WagmiConfig,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { alchemyProvider } from "wagmi/providers/alchemy";
// import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider } = configureChains(
  [
    ...defaultChains,
    chain.polygon,
    chain.polygonMumbai,
    // chain.hardhat,
    chain.localhost,
  ],
  [
    alchemyProvider({
      alchemyId: process.env.REACT_APP_POLYGON_MUMBAI_KEY,
    }),

    // jsonRpcProvider({
    //   rpc: (_chain) => ({
    //     http: "http://localhost:8545",
    //   }),
    // }),

    publicProvider(),
  ]
);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider,
  // provider: (config) => {
  //   if (config.chainId === chain.localhost.id) {
  //     return new providers.JsonRpcProvider();
  //   }
  //   // console.dir(chains, chain, config);

  //   return provider(config);
  //   // return getDefaultProvider(config.chainId);
  // },
});

export default function Wagmi({ children }) {
  return <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>;
}
