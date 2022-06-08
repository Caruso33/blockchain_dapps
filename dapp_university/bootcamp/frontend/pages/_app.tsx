import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import {
  defaultChains,
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from "wagmi";
import { appReducers, initialState } from "../state";
import { AppStateProvider } from "../state/context";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";
import "../styles/globals.css";

const { chains, provider } = configureChains(
  [...defaultChains, chain.hardhat, chain.polygon, chain.polygonMumbai],
  [publicProvider()]
);

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AppStateProvider reducer={appReducers} initialState={initialState}>
        <WagmiConfig client={wagmiClient}>
          <Component {...pageProps} />
        </WagmiConfig>
      </AppStateProvider>
    </ChakraProvider>
  );
}

export default MyApp;
