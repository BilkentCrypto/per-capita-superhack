import { createPublicClient, http } from "viem";
import { optimismGoerli, goerli } from "viem/chains";

const alchemyL1Key = process.env.REACT_APP_ALCHEMY_L1_KEY;
const alchemyL2Key = process.env.REACT_APP_ALCHEMY_KEY;
const L1_url = 'https://eth-goerli.g.alchemy.com/v2/';
const L2_url = 'https://opt-goerli.g.alchemy.com/v2/';

const alchemyL1 = http(L1_url + alchemyL1Key);
const alchemyL2 = http(L2_url + alchemyL2Key);


const publicClientL1 = createPublicClient({
    chain: goerli,
    transport: alchemyL1
});

const publicClientL2 = createPublicClient({
    chain: optimismGoerli,
    transport: alchemyL2
});


export {publicClientL1, publicClientL2};