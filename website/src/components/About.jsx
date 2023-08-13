// About.js
import React from 'react';
import AboutCard from '../components/AboutCard';

const About = () => {
  return (
    <div className="w-full  bg-[#02050E] flex flex-col items-center justify-center">
      <h1 className="text-4xl hidden md:block mb-20 px-8 ml-10 md:text-5xl font-bold text-white md:mt-0">
        Join and Launch NFT Distribution
      </h1>
      <div className="flex mb-20 flex-wrap justify-center gap-3 w-full max-w-7xl mx-auto px-4 items-center">
        <AboutCard
          logo="./images/worldcoin.png"
          title="WorldCoin"
          subTitle="It is important to protect against Sybil attacks in giveaways, and that's why we use WorldCoin. Thanks to WorldCoin, the same person cannot participate in same NFT giveaways multiple times."
        />
        <AboutCard
          logo="./images/zora.png"
          title="Zora"
          subTitle="PerCapita's main contracts have been deployed on the Zora blockchain, enabling all transactions within PerCapita to be conducted rapidly, affordably, and securely."
        />
        <AboutCard
        
          logo="./images/hyperline.png"
          title="Hyperlane"
          subTitle="In order to safeguard our application from Sybil attacks, we wanted to utilize WorldCoin, and for fair selection, we aimed to use ChainLink VRF. However, these contracts were not available on Zora. Fortunately, thanks to Hyperlane, we were able to acquire these Dapps from other chains and integrate them into Zora."
        />
        <AboutCard
          logo="./images/chainlink.png"
          title="ChainLink"
          subTitle="PerCapita utilizes Chainlink's VRF system to ensure fair and secure lotteries for NFT giveaways."
        />
      </div>
    </div>
  );
};

export default About;

