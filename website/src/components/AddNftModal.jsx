import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { alchemy } from '../utils/getAlchemy';
import { useAccount } from 'wagmi';
import NftCard from './NftCard';
import ModalNftCard from './ModalNftCard';

const AddNftModal = ({ images, onClose, collectionAddress }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [myNfts, setMyNfts] = useState([]);

  const { address } = useAccount();

  const fetchNfts = async () => {
    console.log(collectionAddress)
    const newMyNfts = await alchemy.nft.getNftsForOwner(address, {contractAddresses: [collectionAddress] });
    console.log("nfts", newMyNfts)
    setMyNfts(newMyNfts.ownedNfts);
  }

  useEffect( () => {
    if(address) {
      fetchNfts();
    }

  }, [address] )


  const handleImageClick = (index) => {
    const isSelected = selectedImages.includes(index);

    if (isSelected) {
      setSelectedImages(selectedImages.filter((selected) => selected !== index));
    } else {
      setSelectedImages([...selectedImages, index]);
    }
  };

  const handleSelectAll = () => {
    if (isButtonClicked) {
      setSelectedImages([]);
      setIsButtonClicked(false);
    } else {
      setSelectedImages([...Array(images.length).keys()]);
      setIsButtonClicked(true);
    }
  };

  const handleConfirm = () => {
    console.log("Confirmed images:", selectedImages);
  };

console.log(myNfts)
  const nftComponents = myNfts.map( (value) => {
    return <ModalNftCard key={value.tokenId} title={value.title} imageUrl={value.media[0].gateway}/>
  } )
  console.log("comps", nftComponents)

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="w-fit h-[80%] bg-gray-900 rounded-xl p-4 overflow-hidden flex flex-col justify-center items-center">
        <div className="w-full h-4 flex justify-end">
          <AiOutlineClose className="text-white text-xl cursor-pointer" onClick={onClose} />
        </div>
        <div className="text-white text-xl text-center font-bold mb-4">Add Your NFTs</div>
        <button
          className={`w-full py-2 mt-2 mb-4 text-white rounded-lg ${isButtonClicked ? 'bg-red-600' : 'bg-blue-600'}`}
          onClick={handleSelectAll}
        >
          {isButtonClicked ? 'Unselect All' : 'Select All'}
        </button>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 h-[60%] w-fit mb-6 rounded-lg overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-thumb-blue-600 gap-4">
        {nftComponents}
        </div>
        <button className="w-[80%] py-2 bg-purple-800 font-semibold text-white hover:bg-purple-700 rounded-lg" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default AddNftModal;

