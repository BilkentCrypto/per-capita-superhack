import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import SvgIcon from '../components/SvgIcon';
import { retireNft } from '../utils/web3/carbonMarket';

const NftCard = ({ id, price }) => {
  const [nftData, setNftData] = useState({});

  const fetchNftData = async (id) => {
    setNftData({
      id: id,
      name: 'Collection #' + id,
      cert_id: id * 52,
      image: '/nft.jpeg',
    });
  };

  const retire = async () => {
      await retireNft(nftData.id);
  };

  useEffect(() => {
    fetchNftData(id);
  }, [id]);

  return (
    <div className="flex w-full items-center justify-center shadow-2xl">
      <div className="w-full  overflow-hidden rounded-md max-w-sm p-2 flex flex-col">
        <div className="flex items-center justify-center p-2 text-center border-b border-gray-200">
          <h3 className="text-left text-lg text-black font-semibold text-center">
            {nftData.name}
          </h3>
        </div>

        <div className="flex items-center justify-center border-b border-gray-200">
          <Link
            to={`/detail/${id}`}
            className="flex items-center justify-center p-3"
          >
            <img src={nftData.image} alt={nftData.name} />
          </Link>
        </div>
        <div className="flex justify-between p-5">
          <div className="w-full flex items-center justify-center  font-bold">
            <span className="mr-auto">Price:</span>
            <div className="flex items-center justify-center">
              <span className="text-lg mr-3 text-black"> {nftData.price}</span>
              <div className="flex items-center justify-center rounded-full w-8 h-8">
                <SvgIcon icon="CARBON" className="w-5 h-5" />
              </div>
            </div>
            <span>{price}</span>
          </div>
        </div>
        <div className="w-full text-gray-50">
          <button
            onClick={retire}
            className="w-full flex justify-center items-center rounded bg-[#2a2a2a] p-4 hover:bg-[#F9FAFB] hover:text-black"
          >
            Retire
          </button>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
