import React from 'react';

const NftCard = ({ title, imageUrl }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-96 h-[500px] bg-gray-800 rounded-3xl flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
        <img
          src={imageUrl}
          alt="NFT"
          className="w-[336px] h-[365px] rounded-3xl object-contain"
        />
      </div>
    </div>
  );
};

export default NftCard;
