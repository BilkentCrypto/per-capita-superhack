import React, { useEffect, useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import { erc721ABI } from 'wagmi'
import contractAddresses from '../utils/addresses.json';
import mainContractAbi from '../utils/MainAbi.json';
import  {alchemy}  from '../utils/getAlchemy.js'
import { convertToImage, getFile, getUri } from '../utils/getWeb3';

const Card = ({ imageUri, name, contractAddress, price, deadline, id }) => {

//image için nft api gerekiyor gibi


const navigate = useNavigate();

const [image, setImage] = useState();

const getData = async () => {
  const imgFile = await getFile(imageUri);
  setImage( convertToImage(imgFile) );
}


useEffect( () => {
  
getData()
}, [] );

  const handleClick = () => {
    //go to detail page
    console.log("testaa", `/details/${id}`)
    navigate( `/detail/${id}` )
  }

  return (
    <div className="w-400 h-536 bg-gray-700 shadow-md rounded-3xl p-6 flex flex-col items-start">
      <img
        src={image}
        className="w-352 h-352 object-contain mb-5"
      />
      <div className="w-full flex items-center justify-between">
        <p className="text-white text-left text-xl font-medium">{name}</p>
        <p className="text-white flex text-base font-medium gap-2">{price} <p>ETH </p></p>
        <p className="text-white flex text-base font-medium gap-2">{deadline}</p>
      </div>
      <div className="flex items-center">
        <button onClick={() => handleClick()} className="bg-[#7316ff] mt-2 text-white text-base font-medium px-4 py-2 rounded-lg">
          Join Now
        </button>
      </div>
    </div>
  );
};

export default Card;
