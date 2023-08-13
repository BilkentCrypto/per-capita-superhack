
# PerCapita

PerCapita is a Decentralized Initial NFT Offering platform built on Zora in Superhack 2023 Hackathon by Bilkent Blockchain Society.

Below, you can see a brief description of how PerCapita utilizes the sponsor projects of the Superhack hackathon (For more details, scroll below):

[**Zora**](https://docs.zora.co/docs/zora-network/intro): PerCapita Main Contract is built on Zora - OP Stack chain. Zora has built-in NFT marketplace, and NFT Creating contracts which makes creating and trading NFT collections easier in terms of UX. Also, thanks to its OP Stack architecture, these actions with NFTs are scalable and cost-efficient.

[**Worldcoin**](https://worldcoin.org/): PerCapita makes sure that the offerings are sybil-resistant. To achieve Proof of Humanity for the offerings, Worldcoin is used where the collection owners can be certain a person can get at most 1 NFT (Worldcoin is not supported in Zora, we made this possible with Hyperlane; see "Hyperlane" section below).

[**Chainlink**](https://chain.link/): The participant count for the offerings can be more than the supply of the collection, so verifiable randomness should be used to ensure fair distribution of the offered NFTs. Chainlink VRF is used for verifiable randomness (Chainlink VRF is not supported in Zora. We made this possible in Zora with Hyperlane; see below for more)

[**Hyperlane**](https://www.hyperlane.xyz/): Building decentralized apps that hash to ensure fairness and randomness for the functionality of the protocol may require devs to use other protocols like Worldcoin and Chainlink. These key protocols are not supported in Zora, so PerCapita deployed a custom Hyperlane protocol between Goerli-Zora where cross-chain messaging is used to utilize Worldcoin and Chainlink- very crucial for the functionality of PerCapita.


## Description (Go in as much detail as you can about what this project is. Please be as clear as possible!): 

PerCapita is a Decentralized Initial NFT Offering platform built on Zora. Collection owners can utilize PerCapita contract to create a collection offering where the owners can set X amount of ETH  for participant staking to take place in the offering, and set a deadline for the offering to end. Collection owners need to call the createGiveawayMarketplace() function from the PerCapita contract which can be easily done from the PerCapita website. When the offering is created, collection owners need to batch transfer NFTs to the PerCapita contract. 

In order to join the offering, participants can stake X ETH and they can claim their ETH back if they are not the winners. The winners can’t claim their ETH back. Staking can be done via the PerCapita website, and participants can see if they are the winners. Because there are limited number of NFTs, fair, verifiable and randomized selection systems should be used (Chainlink VRF and Worldcoin, explained in depth in the next section).

When the deadline is over for the offering, anyone is incentivized to call the executeGiveaway() function. Successful executor is rewarded (EXPLAIN IN DETAIL HERE!) that is funded from the staked ETH of the winners. Successful and decentralized execution occurs when Chainlink VRF and Worldcoin is utilized, but these protocols are not supported in Zora. Therefore, Hyperlane (Zora -> Goerli lane) is used by PerCapita for cross-chain communication to use Chainlink VRF for random selection and Worldcoin for sybil-prevention. The output from the mentioned protocols are communicated back to PerCapita Main contract on Zora via CrossChainMessagingL1 (Goerli -> Zora).


## How it’s made(Tell us about how you built this project; the nitty-gritty details. What technologies did you use? How are they pieced together? If you used any sponsor technologies, how did it benefit your project? Did you do anything particularly hacky that's notable and worth mentioning?): 

PerCapita platform consists of 3 smart contracts written in Solidity, and a website written in React.js. PerCapita Main Contract is in the Zora Testnet. Another contract called L2HyperlaneBroadcaster is also in Zora. Third contract called L1HyperlaneReceiver is in the Goerli Testnet. 

MainContract.sol: This is the contract where offerings are registered, and where offered NFTs are held. Collection owners can create new offerings with deadline, and Offering Executors can execute the offerings and ensure a fair and randomized offering with an incentive. Calling executeGiveaway() function from this contract does one thing: letting the L2HyperlaneBroadcaster contract know that a collection is ready for retrieving a Chainlink VRF output.  

L2HyperlaneBroadcaster.sol: This contract dispatches a collectionID (that is registered when an offering is created) to the Goerli Testnet from the Zora Testnet. 

L1HyperlaneReceiver.sol: This contract handles incoming messages from the Zora Testnet. Pending collectionIDs are added to an array. Pending IDs are monitored by Chainlink Automation network, and requests randomness for a given collectionID. The callback function from the Chainlink VRF network (fullfillRandomWords) sends the VRF output along with the collectionID to the Zora Testnet (MainContract.sol) via CrossChainMessagingL1. 

In order to join an offering, a participant needs to stake X amount of ETH, and provide a ZK-proof and nullifierHash for Proof of Humanity in the Worldcoin protocol. In this part, Hyperlane Queries API is used to query the Worldcoin contract in the Goerli Testnet to verify the proof, and nullifierHash is stored to prevent participants from joining more than once for an offering. 

Because Zora is not supported by Hyperlane, a custom Hyperlane network (relayer & validator) was deployed for Zora -> Goerli communication lane by the PerCapita team. 

In the PerCapita website, OpenSea API is used to demonstrate the NFTs to the users, and collection owners for a better UI and UX.

Here is a diagram that breaks down how PerCapita works: 
![PerCapitaDiagram](https://github.com/BilkentCrypto/per-capita-superhack/blob/main/per-capita-diagram.png)
