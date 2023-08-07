import React from 'react';

const Card = ({ imageUrl, nftName, price, deadline }) => {
  return (
    <div className="w-400 h-536 bg-gray-700 shadow-md rounded-3xl p-6 flex flex-col items-start">
      <img
        src={imageUrl}
        alt="Product"
        className="w-352 h-352 object-contain mb-5"
      />
      <div className="w-full flex items-center justify-between">
        <p className="text-white text-left text-xl font-medium">{nftName}</p>
        <p className="text-white flex text-base font-medium gap-2">{price} <p>ETH </p></p>
        <p className="text-white flex text-base font-medium gap-2">{deadline}</p>
      </div>
      <div className="flex items-center">
        <button className="bg-[#7316ff] mt-2 text-white text-base font-medium px-4 py-2 rounded-lg">
          Join Now
        </button>
      </div>
    </div>
  );
};

export default Card;
