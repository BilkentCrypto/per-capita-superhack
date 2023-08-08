import React from 'react';

const ModalNftCard = ({ title, imageUrl }) => {
    return (
        <div className="w-60 h-60 flex flex-col items-center hover:scale-[1.05] hover:cursor-pointer">
            <div className="w-48 h-48 bg-gray-700 rounded-3xl flex flex-col items-center justify-center">
                
                <div className='w-32 h-32 rounded-lg flex items-center justify-center'>
                    <img
                        src={imageUrl}
                        alt="NFT"
                        className="rounded-3xl object-contain"
                    />
                </div>
                <hr
  class="my-4 h-0.5 w-full border-2 bg-green opacity-100 dark:opacity-20" />
  <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
            </div>
        </div>
    );
};

export default ModalNftCard;
