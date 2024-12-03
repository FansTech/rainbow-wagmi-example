import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, createConnector, useAccount, useChainId, useConnect, useConnections, useConnectors, useSignMessage } from 'wagmi';
import { arbitrum, base, Chain, mainnet, optimism, polygon } from 'viem/chains';
import { EIP1193Provider } from 'viem/_types/types/eip1193';
import { injected } from 'wagmi/connectors';
import { EthereumProvider } from '@tomo-inc/tomo-telegram-sdk/dist/tomoEvmProvider.esm'
import styles from '../../styles/Home.module.css';

const logoUrl = "https://d13t1x9bdoguib.cloudfront.net/static/tomo.svg"

export const tomoWalletConnector = createConnector((config) => {
  const ethereum = new EthereumProvider({
    metaData: {
      icon: 'your icon url',
      name: 'your dapp name'
    }
  })
  return {
    ...injected(
      {
        shimDisconnect: false,
        target: () => ({
          id: "tomoWallet",
          name: "TOMO Wallet",
          icon: logoUrl,
          provider: ethereum as EIP1193Provider,
        })
      }
    )(config)
  }
})


const chains: readonly [Chain, ...Chain[]] = [
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
];

const config = createConfig({
  connectors: [tomoWalletConnector],
  chains: chains,
  // https://wagmi.sh/react/api/transports
  transports: {

  }
});

const client = new QueryClient();



const WagmiDemo: NextPage = () => {
  const {address} = useAccount();
  const connections = useConnections()
  const { connect, connectors } = useConnect({
  });
  const chainId = useChainId()
  const { signMessageAsync } = useSignMessage()

  return (
    <div className={styles.container}>
      <Head>
        <title>Wagmi App</title>
        <meta
          content="Generated by @rainbow-me/create-rainbowkit"
          name="description"
        />
      </Head>

      <main className={styles.main}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{ display: 'flex', gap: 8 }}
          >
            {
              connectors.map(c => (
                <button onClick={() => { connect({ connector: c }) }}>connect {c.name}</button>
              ))
            }
          </div>

          <div>
            {address}
            <div>account</div>
          </div>

          {!!signMessageAsync && <button onClick={() => signMessageAsync({ message: 'sign test msg' })}>sign msg</button>}
        </div>


        <h1 className={styles.title}>
          Welcome to wagmi +{' '}
          Next.js!
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.tsx</code>
        </p>

      </main>
    </div>
  );
};

function MyApp() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <WagmiDemo />
      </QueryClientProvider>
    </WagmiProvider>

  );
}



export default MyApp;