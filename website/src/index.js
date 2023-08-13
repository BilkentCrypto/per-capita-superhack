import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Layout from './components/Layout';
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider,darkTheme} from "@rainbow-me/rainbowkit";

import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  zora,
  optimismGoerli,
  zoraTestnet,
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

// pages
import Home from './pages/home';
// import Exchange from './pages/exchange.js';
import INO from './pages/INO';
import Detail from './pages/detail';
import CreateNewINO from './pages/CreateNewINO';
import TrackEvents from './pages/TrackEvents';
import Error from './pages/error';
// import Voting from './pages/voting.js';
// import Staking from './pages/staking.js';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));


//WAGMI
const { chains, publicClient } = configureChains(
  [zoraTestnet],
  [
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'Per Capita',
  projectId: 'ebbc27c89ea63989fd5cb0ef3d1a49cd',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})


root.render(
  <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider chains={chains} theme={darkTheme()}>
      <React.StrictMode>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              {/* <Route path="/exchange" element={<Exchange />}></Route> */}
              <Route path="/INOs" element={<INO />}></Route>
              <Route path="/LaunchINO" element={<CreateNewINO />}></Route>
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