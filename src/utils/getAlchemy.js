import { Network, Alchemy } from "alchemy-sdk";


// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_KEY, // Replace with your Alchemy API Key.
  network: Network.OPT_GOERLI, // Replace with your network.
};

const alchemy = new Alchemy(settings);

export {alchemy}