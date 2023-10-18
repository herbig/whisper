import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import {
  goerli,
  mainnet,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    //mainnet,
    goerli,
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Private Posts',
  projectId: 'YOUR_PROJECT_ID', // TODO https://www.rainbowkit.com/docs/installation
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

extendTheme({
  initialColorMode: 'light',
  useSystemColorMode: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
