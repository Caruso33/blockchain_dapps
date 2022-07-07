import { getDefaultProvider, providers } from "ethers";
import {
  chain,
  configureChains,
  createClient,
  defaultChains,
  WagmiConfig,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";

const { chains } = configureChains(
  [
    ...defaultChains,
    chain.polygon,
    chain.polygonMumbai,
    chain.hardhat,
    chain.localhost,
  ],
  [publicProvider()]
);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider: (config) => {
    if (config.chainId === chain.localhost.id)
      return new providers.JsonRpcProvider();

    return getDefaultProvider(config.chainId);
  },
});

export default function Wagmi({ children }) {
  return <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>;
}
