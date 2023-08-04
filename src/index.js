import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Layout from './components/Layout';
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
// pages
import Home from './pages/home.js';
// import Exchange from './pages/exchange.js';
import INO from './pages/INO.js';
import Detail from './pages/detail.js';
import CreateNewNIO from './pages/CreateNewINO.js';
import Error from './pages/error.js';
// import Voting from './pages/voting.js';
// import Staking from './pages/staking.js';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

const MantleNetwork = {
  id: 5001,
  name: 'Mantle',
  network: 'Mantle',
  iconUrl: 'https://example.com/icon.svg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Mantle',
    symbol: 'MNT',
  },
  rpcUrls: {
    default: 'https://rpc.testnet.mantle.xyz',
  },
  blockExplorers: {
    default: { name: 'Mantlescan', url: 'https://explorer.testnet.mantle.xyz' },
  },
  testnet: true,
};


//avalancheFUJIChain

const { chains, provider } = configureChains(
  [MantleNetwork],
  [jsonRpcProvider({ rpc: chain => ({ http: chain.rpcUrls.default }) })]
);

const { connectors } = getDefaultWallets({
  appName: "Project_Name",
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});


root.render(
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>
      <React.StrictMode>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              {/* <Route path="/exchange" element={<Exchange />}></Route> */}
              <Route path="/INO" element={<INO />}></Route>
              <Route path="/CreateNewNIO" element={<CreateNewNIO />}></Route>
              <Route path="/detail/:id" element={<Detail />}></Route>
              {/* <Route path="/voting" element={<Voting />}></Route>
              <Route path="/staking" element={<Staking />}></Route> */}
              <Route path="*" element={<Error code="404" />}></Route>

            </Routes>
          </Layout>
        </Router>
      </React.StrictMode>
    </RainbowKitProvider>
  </WagmiConfig>
);