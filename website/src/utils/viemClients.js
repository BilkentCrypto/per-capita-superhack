import { createPublicClient, http, webSocket } from "viem";
import { optimismGoerli, goerli, zoraTestnet } from "viem/chains";

const alchemyL1Key = process.env.REACT_APP_ALCHEMY_L1_KEY;

const L1_url = 'wss://eth-goerli.g.alchemy.com/v2/';

const alchemyL1 = webSocket(L1_url + alchemyL1Key);

const publicClientL1 = createPublicClient({
    chain: goerli,
    transport: alchemyL1
});

const publicClientL2 = createPublicClient({
    chain: zoraTestnet,
    transport: http()
});


export {publicClientL1, publicClientL2};