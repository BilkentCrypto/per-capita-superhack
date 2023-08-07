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
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

// pages
import Home from './pages/home.js';
// import Exchange from './pages/exchange.js';
import INO from './pages/INO.js';
import Detail from './pages/detail.js';
import CreateNewNIO from './pages/CreateNewINO.js';
import TrackEvents from './pages/trackEvents.js';
import Error from './pages/error.js';
// import Voting from './pages/voting.js';
// import Staking from './pages/staking.js';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));


//WAGMI
const { chains, publicClient } = configureChains(
  [optimismGoerli],
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY }),
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
              <Route path="/INO" element={<INO />}></Route>
              <Route path="/CreateNewNIO" element={<CreateNewNIO />}></Route>
              <Route path="/track" element={<TrackEvents />}></Route>
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