
# PerCapita

PerCapita is a Decentralized Initial NFT Offering platform built on Zora in Superhack 2023 Hackathon by Bilkent Blockchain Society.

[PerCapita Website](https://per-capita-superhack.vercel.app/)

There are currently some problems with NFTs.

- Minting process could be unfair and problematic for average crypto users. Public RPCs could fail during heavy minting traffic. In this way, people with access to their own full node and bots could mint many NFTs from mutliple addresses.
- If there is no Proof of Personhood protocol for NFT collections, NFT collections could be prone to sybil attacks. Collection owners may prefer their collections as distributed as possible. 
- In order to overcome these problems, an Initial NFT Offering platform is needed that ensures fairness, randomness and on-chain distribution.

Below, you can see a brief description of how PerCapita achieves fair and random NFT offerings, and utilizes the sponsor projects of the Superhack hackathon (For more details, scroll below):

[**Zora**](https://docs.zora.co/docs/zora-network/intro): PerCapita Main Contract is built on Zora - OP Stack chain. Zora has built-in NFT marketplace, and NFT Creating contracts which makes creating and trading NFT collections easier in terms of UX. Also, thanks to its OP Stack architecture, these actions with NFTs are scalable and cost-efficient.

[**Worldcoin**](https://worldcoin.org/): PerCapita makes sure that the offerings are sybil-resistant. To achieve Proof of Personhood for the offerings, Worldcoin is used where the collection owners can be certain a person can get at most 1 NFT (Worldcoin is not supported in Zora, we made this possible with Hyperlane; see "Hyperlane" section below).

[**Chainlink**](https://chain.link/): The participant count for the offerings can be more than the supply of the collection, so verifiable randomness should be used to ensure fair distribution of the offered NFTs. Chainlink VRF is used for verifiable randomness (Chainlink VRF is not supported in Zora. We made this possible in Zora with Hyperlane; see below for more)

[**Hyperlane**](https://www.hyperlane.xyz/): Building decentralized apps that hash to ensure fairness and randomness for the functionality of the protocol may require devs to use other protocols like Worldcoin and Chainlink. These key protocols are not supported in Zora, so the PerCapita team deployed a custom Hyperlane protocol between Goerli-Zora where cross-chain messaging is used to utilize Worldcoin and Chainlink- very crucial for the functionality of PerCapita. Hyperlane deployment on Zora could be done by the PerCapita team thanks to the permissionless interoperability of Hyperlane. Hyperlane validator and relayers for Zora running 24/7 on a dedicated server.


## Description: 

PerCapita is a Decentralized Initial NFT Offering platform built on Zora. Collection owners can utilize PerCapita contract to create a collection offering where the owners can set X amount of ETH  for participant staking to take place in the offering and set a deadline for the offering to end. Collection owners need to call the "Create Giveaway Marketplace" function from the PerCapita contract which can be easily done from the PerCapita website. When the offering is created, collection owners need to batch transfer NFTs to the PerCapita contract. 

In order to join the offering, participants should prove their personhood by World ID and their participation for the first and only time. After verification, participants can stake X ETH and they can claim their ETH back if they are not the winners. The winners can claim the NFT they earn; however, they can’t claim their deposited ETH back. Staking can be done via the PerCapita website, and participants can see if they are the winners and which NFT they won. Although there is a limited number of NFTs, there are many people who can participate. Therefore, fair, verifiable and randomized selection systems and proof of personhood protocols should be used (Chainlink VRF and Worldcoin, explained in depth in the next section).

When the deadline is over for the offering, anyone is incentivized to call the "Execute Giveaway" function. A successful executor is rewarded. Since smart contracts can't call themselves autonomously, PerCapita incentivizes individuals to execute offerings through execution rewards. Execution rewards are funded from the staked ETH of the potential winner amount of the offering. The reward increases over time, and when it is more than the gas fee, individuals are expected to run the function and receive the reward, as per game theory. Successful and decentralized execution requests a random seed from Chainlink from L1 (Goerli) via Hyperlane for determining winners.

PerCapita uses Chainlink VRF and Worldcoin protocols; however, these protocols are not supported in Zora. Therefore, Hyperlane (Zora -> Goerli lane) is deployed and used by PerCapita for cross-chain communication to use Chainlink VRF for random selection and Worldcoin for Sybil attack prevention. The output from the mentioned protocols is communicated back to PerCapita Main contract on Zora via CrossChainMessagingL1 (Goerli -> Zora).


## How it’s made:

UPDATE: We have migrated our contract from Goerli to Sepolia.

PerCapita platform consists of three smart contracts written in Solidity, and a website written in React.js. PerCapita Main Contract is in the Zora Testnet. Another contract called L2HyperlaneBroadcaster is also in Zora. Third contract called L1HyperlaneReceiver is in the Goerli Testnet. 

MainContract.sol: This is the contract where offerings are created, and where offered NFTs are held. Collection owners can create new offerings with deadline, and Offering Executors can execute the offerings and ensure a fair and randomized offering with an incentive. Calling executeGiveaway() function from this contract does one thing: letting the L2HyperlaneBroadcaster contract know that a collection is ready for retrieving a Chainlink VRF output. In addition, being participant in offerings is done with this contract. After submitting personhood proof and staking the required ETH, the proof is sent to L1 (Goerli) via L2 L2HyperlaneBroadcaster contract.

L2HyperlaneBroadcaster.sol: This contract dispatches the collectionID (that is registered when an offering is created) for receiving random seed from the Chainlink VRF to the Goerli from the Zora Testnet. Also, personhood proofs are sent to L1 (Goerli) to verify proof on the WorldID contract on-chain.

L1HyperlaneReceiver.sol: This contract handles incoming messages from the Zora Testnet. Pending collectionIDs are added to an array. Pending IDs are monitored by Chainlink Automation network, and requests randomness for a given collectionID. The callback function from the Chainlink VRF network (fullfillRandomWords) sends the VRF output along with the collectionID to the Zora Testnet (MainContract.sol) via CrossChainMessagingL1. After receiving a random seed from VRF, the random seed is sent to L1->L2 via CrossChainMessagingL1 contract, which is a technology of OP Stack.

In order to join an offering, a participant needs to stake X amount of ETH, and provide a ZK-proof and nullifierHash for Proof of Personhood in the Worldcoin protocol. In this part, Hyperlane technology is used to verify personhood proof on the Worldcoin contract in the Goerli Testnet, and nullifierHash is stored to prevent participants from joining more than once for an offering. External nullifier hash is used by Worldcoin app to establish proof for unique actions. We have used dynamic external nullifier hashes to join each offering once but to join multiple offerings. Hashes are determined as "bePart_" + offeringId for each offering.

In PerCapita, it is used an infrequent method for determining winners of the offerings. Frequently, iterative methods are used by contracts to determine multiple winners. However, if there are N NFTs, there should be N winners and iterative methods solve this problem in linear time complexity, such as O(N). In PerCapita, Lehmer random number generation algorithm is used. A function f(x) is generated deterministically using a random seed received from Chainlink VRF. While each user participates in the offerings, a number is determined according to the order of participation, like a lottery ticket. Let's assume there are M participants and N NFTs; our random function y = f(x) generates 0 <= y < M if inputs are between 0 <= x < M. If f(lottery ticket) function output is smaller than N, which we assume as NFT amount, the individual wins NFT which is indexed as the output of f(lottery ticket) function. In contrast, if f(lottery ticket) >= N, it shows that the participant didn't win any NFT and can claim their deposit back. Thanks to Lehmer random number generator, determining winners of offering has constant time complexity, which is O(1).

Because Zora is not supported by Hyperlane, custom Hyperlane operators (relayer & validator) were deployed for the Zora -> Goerli communication lane by the PerCapita team. These operators run 24/7 on a dedicated server.

In the PerCapita website, OpenSea API is used to demonstrate the NFTs to the users and collection owners for a better UI and UX.

Here is a diagram that breaks down how PerCapita works: 
![PerCapitaDiagram](https://github.com/BilkentCrypto/per-capita-superhack/blob/main/per-capita-diagram.png)
