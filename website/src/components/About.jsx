// About.js
import React from 'react';
import AboutCard from '../components/AboutCard';

const About = () => {
  return (
    <div className="w-full  bg-[#02050E] flex flex-col items-center justify-center">
      <h1 className="text-4xl hidden md:block mb-20 px-8 ml-10 md:text-5xl font-bold text-white md:mt-0">
        Join and Create NFT Distribution
      </h1>
      <div className="flex mb-20 flex-wrap justify-center gap-3 w-full max-w-7xl mx-auto px-4 items-center">
        <AboutCard
          logo="./images/worldcoin.png"
          title="Use WorldCoin"
          subTitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        />
        <AboutCard
          logo="./images/zora.png"
          title="Join INO"
          subTitle="Praesent pulvinar dolor sed turpis elementum, ac viverra est maximus."
        />
        <AboutCard
          logo="./images/hyperline.png"
          title="Create Your Own INO"
          subTitle="Integer interdum nisi nec neque interdum, in eleifend arcu faucibus."
        />
      </div>
    </div>
  );
};

export default About;

