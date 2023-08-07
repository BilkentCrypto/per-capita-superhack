import React from 'react';
import NftCard from './NftCard';
import Image from '../assets/Image.png';
import { AiOutlinePlus } from 'react-icons/ai';

const DetailFooter = () => {
  return (
    <div className="flex flex-col items-left bg-black py-4 px-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-white text-3xl font-bold">
          All NFTs
        </div>
        <button className="w-44 h-16 p-4 rounded-lg items-center border border-blue-600 hover:bg-blue-700 justify-center items-start gap-2.5 inline-flex">
          <AiOutlinePlus className="text-white text-base" />
          <div className="text-white text-base font-semibold capitalize leading-loose">Add NFT</div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 md:mt-16 gap-6">
        <NftCard title="My NFT Title" imageUrl={Image} />
        <NftCard title="My NFT Title" imageUrl={Image} />
        <NftCard title="My NFT Title" imageUrl={Image} />
      </div>
    </div>
  );
};

export default DetailFooter;
