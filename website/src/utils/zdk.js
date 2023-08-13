import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";

const networkInfo = {
    network: ZDKNetwork.Zora,
    chain: ZDKChain.ZoraGoerli,
  }

const API_ENDPOINT = "https://api.zora.co/graphql";
const args = { 
              endPoint:API_ENDPOINT, 
              networks:[networkInfo], 
              //apiKey: process.env.ZORA_API_KEY
            } 

const zdk = new ZDK(args) // All arguments are optional

export default zdk;