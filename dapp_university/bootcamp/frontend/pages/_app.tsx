import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { createClient, WagmiConfig } from "wagmi";
import { AppStateProvider } from "../state/context";
import { appReducers, initialState } from "../state";

import "../styles/globals.css";

const wagmiClient = createClient({ autoConnect: true });

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
