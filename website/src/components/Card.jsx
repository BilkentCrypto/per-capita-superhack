import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { erc721ABI } from 'wagmi'
import contractAddresses from '../utils/addresses.json';
import mainContractAbi from '../utils/MainAbi.json';
import { convertToImage, getFile, getUri } from '../utils/getWeb3';
import Image from '../assets/fire.png'
const Card = ({ imageUri, name, contractAddress, price, deadline,time, id }) => {

  //image için nft api gerekiyor gibi


  const navigate = useNavigate();

  const [image, setImage] = useState();

  const getData = async () => {
    const imgFile = await getFile(imageUri);
    setImage(convertToImage(imgFile));
  }


  useEffect(() => {

    getData()
  }, []);

  const handleClick = () => {
    //go to detail page
    console.log("testaa", `/details/${id}`)
    navigate(`/detail/${id}`)
  }

  return (
    <div className=" w-[350px] h-[536px] mb-5 mt-5 bg-gray-800 rounded-3xl p-6 flex flex-col items-start justify-between shadow-lg">
      <img
        src={image}
        className="self-center w-[336px] h-[352px] object-contain mb-5 rounded-xl"
      />
      <p className="text-white text-xl font-bold capitalize leading-loose">{name}</p>
      <div className="w-full flex items-center justify-between">
        <p className="text-white flex text-base font-medium gap-2">
        <span className="text-white">Join Price:</span>
        <span className="text-white font-bold">{price}</span><span className="text-white font-bold">ETH</span>
        </p>
        <p className="text-white flex text-base font-medium gap-2">{deadline}</p>
      </div>
      <li className="flex flex-col w-[300px] px-2 py-2 mt-2 bg-gray-600 rounded-lg">
  <div className="flex items-center justify-center">
    <div className="flex flex-col text-center items-center justify-center">
      <div className="flex items-center">
        <img src={Image} alt="Fire Icon" className="w-6 h-6 mr-2" />
        <span className="text-white text-base font-bold capitalize">{time}</span>
      </div>
    </div>
  </div>
</li>





      <div className="flex items-center justify-end">

        <button
          onClick={() => handleClick()}
          className="bg-[#7316ff] w-[300px] mt-2 text-white text-base font-medium px-4 py-2 rounded-lg hover:bg-[#7d27ff] hover:scale-[1.03]"
        >
          Join Now
        </button>

      </div>
    </div>
  );
}
export default Card;
