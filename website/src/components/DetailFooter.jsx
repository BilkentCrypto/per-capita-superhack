import React, { useEffect, useState } from 'react';
import NftCard from './NftCard';
import Image from '../assets/Image.png';
import { AiOutlinePlus } from 'react-icons/ai';
import AddNftModal from './AddNftModal'; 
import { alchemy } from '../utils/getAlchemy';

const DetailFooter = ({collectionAddress}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const images = [Image, Image, Image, Image, Image];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  return (
    <div className="flex flex-col items-left bg-black py-4 px-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-white text-3xl font-bold">
          All NFTs
        </div>cd
        <button className="w-44 h-16 p-4 rounded-lg items-center border border-blue-600 hover:bg-blue-700 justify-center gap-2.5 inline-flex" onClick={handleOpenModal}>
          <AiOutlinePlus className="text-white text-base" />
          <div className="text-white text-base font-semibold capitalize leading-loose">Add NFT</div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 md:mt-16 gap-y-12 gap-x-28">
        <NftCard title="My NFT Title" imageUrl={Image} index={0} isFooter/>
        <NftCard title="My NFT Title" imageUrl={Image} index={1} isFooter/>
        <NftCard title="My NFT Title" imageUrl={Image} index={2} isFooter/>
      </div>

      {isModalOpen && <AddNftModal images={images} onClose={handleCloseModal} collectionAddress={collectionAddress} />}
    </div>
  );
};

export default DetailFooter;
