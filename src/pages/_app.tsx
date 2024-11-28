import Script from 'next/script';

import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Chain, RainbowKitProvider } from '@rainbow-me/rainbowkit';

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { rainbowWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';

import { WagmiProvider, createConfig, createConnector, http } from 'wagmi';
import { arbitrum, base, mainnet, optimism, polygon } from 'viem/chains';
import { DefaultWalletOptions, Wallet } from '@rainbow-me/rainbowkit/dist/wallets/Wallet';
import { EIP1193Provider } from 'viem/_types/types/eip1193';
import { injected } from 'wagmi/connectors';
import type { EthereumProvider as EthereumProviderInstance } from '@tomo-inc/tomo-telegram-sdk'


const client = new QueryClient();

const logoUrl = "https://tomo.inc/images/logo.svg"
const tomoWallet = ({
  walletConnectParameters,
  projectId,
}: DefaultWalletOptions): Wallet => {
  let provider: unknown | EIP1193Provider
  return {
    id: 'TomoWallet',
    name: 'Tomo Wallet',
    // iconUrl: sdk.getAppInfo().logo,
    iconUrl: logoUrl,
    installed: true,
    iconBackground: '#000000',
    createConnector: (walletDetails) => {
      return createConnector((config) => ({
        ...injected({
          // shimDisconnect: false
        })(config),
        ...walletDetails,
        getProvider: async () => {
          if (provider) return provider
          const EthereumProvider = (await import("@tomo-inc/tomo-telegram-sdk/dist/tomoEvmProvider.esm")).EthereumProvider as typeof EthereumProviderInstance
          const sdk: EthereumProviderInstance = new EthereumProvider({
            bridge: 'https://bridge-dev.anyconn.org/v1/sub',
            connect: 'https://tg-dev.tomo.inc/bot-server/sdk/signature',
            connect_direct_link: 'https://t.me/AlvinsDemoBot/TOMOSDK',
            metaData: {
              icon: walletConnectParameters?.metadata?.icons?.[0] || '',
              name: walletConnectParameters?.metadata?.name || '',
              description: walletConnectParameters?.metadata?.description,
              url: walletConnectParameters?.metadata?.url,
            }
          })
          provider = sdk
          return provider
        },
      }))
    },

  };
};

const chains: readonly [Chain, ...Chain[]] = [
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
];


const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [tomoWallet, rainbowWallet, walletConnectWallet],
    },
  ],
  {
    appName: 'test demo',
    projectId: 'YOUR_PROJECT_ID',
  }
);

const config = createConfig({
  // use rainbowkit wallets
  connectors,

  // only use wagmin connectors
  // connectors:[uxuyWalletConnector, injected()],
  chains: chains,
  // https://wagmi.sh/react/api/transports
  transports: {
  //   [mainnet.id]: http("<YOUR_RPC_URL>")
  }
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>

  );
}

export default MyApp;
