import Typed from 'react-typed';
import { useEffect, useState } from 'react';
import Card from './Card';
import contractAddresses from '../utils/addresses.json';
import mainContractAbi from '../utils/MainAbi.json';
import { formatEther, parseGwei } from 'viem';
import { formatUnits } from 'viem';
import { readContract, writeContract } from '@wagmi/core';
import { useContractRead } from 'wagmi';
import inoTypes from '../utils/inoTypes';
import { useNavigate } from 'react-router-dom';


function Home() {

  const navigate = useNavigate();

  const navigateInos = () => {
    navigate('/INOs')
  }

  const readContract = useContractRead({
    address: contractAddresses.Main,
    abi: mainContractAbi,
    functionName: 'fetchMarketplace',
    args: [1]
  }) 

  const collectionData = readContract.data;

  return (
    <>
      <section className="w-full pt-24 md:pt-0 md:h-screen bg-[#02050E] relative flex flex-col md:flex-row justify-center items-center">
        <div className="container mt-10 md:w-1/2 lg:pl-18 xl:pl-24  md:pl-16 flex flex-col md:items-start md:text-left items-center text-center md:ml-24">
          <h1 className="text-4xl mt-10 leading-[44px] md:text-4xl text-white md:leading-tight lg:text-6xl lg:leading-[1.2] font-bold md:tracking-[-2px]">
            NFT distribution that is{' '}
          </h1>
          <Typed
            className="py-3 max-w[200px] text-5xl md:text-6xl bg-clip-text font-extrabold  text-transparent bg-gradient-to-r from-[#7316ff] to-[#f813e1]"
            strings={['fair.', 'decentralized.', 'fast.']}
            typeSpeed={120}
            backSpeed={140}
            loop
          />

          <p className="pt-4 pb-8 md:pt-6 text-gray-400 md:pb-12 max-w-[480px] text-lg text-center lg:text-left">
            You can efficiently distribute NFTs per person in a way that is resistant to Sybil attacks by Initial NFT Offerings.
          </p>

          <button onClick={navigateInos} className="bg-[#7316ff] mb-5 text-white text-base font-medium px-6 py-3 rounded-lg
          hover:bg-[#7d27ff] hover:scale-[1.03]">
            Discover INOs
          </button>
        </div>
        <div className="lg:max-w-lg w-full md:w-1/2 md:mr-28  mb-6 md:mt-20 flex justify-center items-center">
          <div className="w-full md:max-w-[400px] max-w-[100vw] flex justify-center items-center">

            {collectionData && <Card imageUri={collectionData.imageUri} name={collectionData.name} contractAddress={ collectionData.contractAddress} targetTime={collectionData.giveawayTime.toString()} price={formatEther(collectionData.price)} id={1} participant={collectionData.participantNumber.toString()} inoType={inoTypes.Normal}/>}

          </div>
        </div>
      </section>
    </>
  );
}

export default Home;

