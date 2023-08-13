import React from 'react';

const NftCard = ({ title, imageUrl, index, onClick, isWinner }) => {
  return (
    <div
      onClick={onClick}
      className="scale-100 md:w-96 md:h-[400px] w-full h-[300px] flex flex-col items-center hover:scale-[1.05] hover:cursor-pointer"
    >
      <span className='z-50 select-none flex items-center justify-center w-12 h-12 bg-red-900 absolute -translate-y-1/2 -translate-x-[190px] rounded-2xl text-2xl text-white font-semibold'>
        {index}
      </span>

      <div className="w-full h-[300px] scale-100 md:w-96 md:h-[400px] overflow-hidden bg-gray-800 rounded-3xl flex flex-col items-center justify-center">
        {isWinner && (
          <div className="select-none flex items-center justify-center w-12 h-12 absolute -translate-y-[175px] -translate-x-[-175px]">
            <div
              className="absolute transform rotate-45 bg-green-600 text-center text-white font-semibold py-1 right-[-35px] top-[32px] w-[170px]"
            >
              WINNER
            </div>
          </div>
        )}
        <h2 className="text-2xl font-semibold text-white mb-5 md:mb-10">{title}</h2>
        <img
          src={imageUrl}
          alt="NFT"
          className="select-none w-[336px] h-[160px] md:h-[220px] rounded-3xl object-cover"
        />
      </div>
    </div>
  );
};

export default NftCard;
