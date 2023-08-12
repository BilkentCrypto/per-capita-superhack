import React from 'react';

const NftCard = ({ title, imageUrl, index, onClick }) => {
  return (
    <div onClick={onClick} 
    className="flex flex-col items-center  hover:scale-[1.05] hover:cursor-pointer">
      
      <span className='select-none flex items-center justify-center w-12 h-12 bg-red-900 absolute -translate-y-1/2 -translate-x-[190px] rounded-2xl text-2xl text-white font-semibold'>
        {index}
      </span>
    
      <div className="w-96 h-[400px] bg-gray-800 rounded-3xl flex flex-col items-center justify-center">
        
        <h2 className="text-2xl font-semibold text-white mb-10">{title}</h2>
        <img
          src={imageUrl}
          alt="NFT"
          className="select-none w-[336px] h-[220px] rounded-3xl object-contain"
        />
        
      </div>
    </div>
  );
};

export default NftCard;
