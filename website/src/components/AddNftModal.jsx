import React, { useState, useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useAccount } from 'wagmi';
import NftCard from './NftCard';
import ModalNftCard from './ModalNftCard';
import { writeContract } from '@wagmi/core'
import contractAddresses from '../utils/addresses.json';
import mainContractAbi from '../utils/MainAbi.json';
import { getImageUrl } from '../utils/getWeb3';
import zdk from '../utils/zdk';

const AddNftModal = ({ onClose, collectionAddress, marketplaceId }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [myNfts, setMyNfts] = useState([]);

  const { address } = useAccount();

  const fetchNfts = async () => {
    if(address) {
      const options = {method: 'GET', headers: {accept: 'application/json'}};

      const contractNfts = await (await fetch(`https://testnets-api.opensea.io/v2/chain/zora_testnet/contract/${collectionAddress}/nfts?limit=50`, options)).json();
      console.log("contract Nfts", contractNfts);
  
      const nftMetadatas = await Promise.all (contractNfts.nfts.map( async (value) => {
        const nftMetadata = await (await fetch(`https://testnets-api.opensea.io/v2/chain/zora_testnet/contract/${collectionAddress}/nfts/${value.identifier}`, options)).json();
        return nftMetadata
  
      } ));
  
      nftMetadatas.sort( (a, b) => a.nft.identifier - b.nft.identifier );
      const filteredNfts = nftMetadatas.filter((value ) => value.nft.owners[0].address.toLowerCase() === address.toLowerCase())
  
  
      const newNfts = filteredNfts.map( value => {
        return {
          tokenId: value.nft.identifier,
          title: value.nft.name,
          imageUrl: value.nft.image_url,
        }
      } ) 
  
      console.log("formatted nfts", newNfts);
      setMyNfts(newNfts);
  }
  }
  useEffect( () => {

  fetchNfts();
 
  }, [address] )


  const handleImageClick = (id) => {
    const isSelected = selectedImages.includes(id);

    if (isSelected) {
      setSelectedImages(selectedImages.filter((selected) => selected !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
    
  };
  console.log("selected", selectedImages)

  const handleSelectAll = () => {
    if (isButtonClicked) {
      setSelectedImages([]);
      setIsButtonClicked(false);
    } else {
      setSelectedImages( myNfts.map( value =>  value.tokenId ) );
      setIsButtonClicked(true);
    }
  };



  const handleConfirm = async () => {
    
    console.log("Confirmed images:", selectedImages);
    const { hash } = await writeContract({
      address: contractAddresses.Main,
      abi: mainContractAbi,
      functionName: 'addAllNFTstoMarketplace',
      args: [marketplaceId, selectedImages],
      watch: true,
    });
    onClose();
  };

console.log(myNfts)
  const nftComponents = myNfts.map( (value) => {
    return <ModalNftCard key={value.tokenId} selected={ selectedImages.includes(value.tokenId) } onClick={() => handleImageClick(value.tokenId)} title={value.title} imageUrl={value.imageUrl}/>
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
          className={`w-56 py-2 mt-2 mb-4 mx-4 self-start font-semibold text-white rounded-lg ${isButtonClicked ? 'bg-rose-800  hover:bg-rose-700' : 'bg-indigo-800 hover:bg-indigo-700'}`}
          onClick={handleSelectAll}
        >
          {isButtonClicked ? 'Unselect All' : 'Select All'}
        </button>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 h-[60%] w-fit mb-6 rounded-lg overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-thumb-blue-600 gap-8">
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

