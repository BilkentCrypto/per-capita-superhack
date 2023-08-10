import React from 'react';

const ModalNftCard = ({ title, imageUrl, selected, onClick }) => {
    return (
            <div className= { !selected ?
                "select-none shadow-xl m-4 w-48 h-48 bg-gray-700 rounded-3xl flex flex-col items-center justify-center border-gray-600 border-4 hover:scale-[1.05] hover:cursor-pointer"
                :
                "select-none shadow-xl m-4 w-48 h-48 bg-gray-700 rounded-3xl flex flex-col items-center justify-center border-rose-900 border-4 scale-[1.05]  hover:cursor-pointer"
            }
            onClick={onClick}
            >
    
                <div>
                    <img
                        src={imageUrl}
                        alt="NFT"
                        className="mb-4 mt-8 rounded-3xl object-contain h-24 w-fit"
                    />
                </div>
                <hr class="h-0.5 w-full border-2 bg-green opacity-100 dark:opacity-20" />
                <div className='h-12'>
                <h2 className="h-10 text-lg text-center font-semibold break-all text-ellipsis overflow-hidden text-white opacity-90">{title}</h2>
                </div>
            </div>
    );
};

export default ModalNftCard;
