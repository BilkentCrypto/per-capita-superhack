import React from 'react';
import AboutCard from '../components/AboutCard';

const About = () => {
  return (
    <div className="w-full min-h-screen bg-[#02050E] flex flex-col items-center justify-center">
      <h1 className="text-4xl mt-15 hidden md:block px-10 ml-10 md:text-5xl font-bold text-white mb-8 md:mt-0">
        Join and Create NFT Distribution
      </h1>
      <div className="flex flex-col md:flex-row justify-center gap-6 w-full max-w-7xl mx-auto px-4 items-center">
        <AboutCard
          logo="./images/nft.png"
          title="Use WorldCoin"
          subTitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        />
        <AboutCard
          logo="./images/nft.png"
          title="Join INO"
          subTitle="Praesent pulvinar dolor sed turpis elementum, ac viverra est maximus."
        />
        <AboutCard
          logo="./images/nft.png"
          title="Create Your Own INO"
          subTitle="Integer interdum nisi nec neque interdum, in eleifend arcu faucibus."
        />
      </div>
    </div>
  );
};

export default About;
