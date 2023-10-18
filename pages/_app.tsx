import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [ goerli ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Whisper',
  projectId: '30f1930b48580d201d384a803dea2688',
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
