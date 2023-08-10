import React, { useEffect, useState } from 'react';
import NftCard from './NftCard';
import { AiOutlinePlus } from 'react-icons/ai';
import AddNftModal from './AddNftModal'; 
import { alchemy } from '../utils/getAlchemy';
import { useContractRead, useAccount, erc721ABI } from 'wagmi';
import contractAddresses from '../utils/addresses.json';
import mainContractAbi from '../utils/MainAbi.json';
import { writeContract } from '@wagmi/core'
import { generateOpenseaUrl } from '../utils/marketplaceGenerator';

const DetailFooter = ({collectionAddress, nftIds, marketplaceId, isPast, isOwner}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { address } = useAccount();
  const [nfts, setNfts] = useState([]);

  const isApprovedRequest = useContractRead({
    address: collectionAddress,
    abi: erc721ABI,
    functionName: 'isApprovedForAll',
    args: [address, contractAddresses.Main ],
    watch: true,
  });


  const fetchNfts = async () => {
    const requestTokens = nftIds?.map( (value) => {
      return {contractAddress: collectionAddress,
      tokenId: value.toString(),
      tokenType: 'ERC721'}
    } )
    console.log("new", nftIds)
    if(nftIds && nftIds.length > 0) {
      const newNfts = await alchemy.nft.getNftMetadataBatch( requestTokens );
      setNfts(newNfts);
      console.log("new nfts", newNfts);
    }

  }
  useEffect( () => {
 
      fetchNfts();
  

  }, [nftIds] )

  const isApproved = isApprovedRequest.data;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleApprove = async () => {
    const { hash } = await writeContract({
      address: collectionAddress,
      abi: erc721ABI,
      functionName: 'setApprovalForAll',
      args: [contractAddresses.Main, true],
    });
  }

  const handleImageClick = (tokenId) => {
    const url = generateOpenseaUrl(collectionAddress , tokenId);
    window.open(url, '_blank', 'noreferrer');
    console.log("url", url)
  }

  console.log("approve", isApproved)

  const nftComponents = nfts.map( (value, index) => {
    return <NftCard key={value.tokenId} onClick={() => handleImageClick(value.tokenId)} title={value.title} imageUrl={value.media[0].gateway} index={index}/>
  } )

  return (
    <div className="flex flex-col items-left bg-black py-4 px-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-white text-3xl font-bold">
          All NFTs
        </div>
        <div className="flex items-center">
          {!isPast && !isApproved && (
            <button className="w-44 h-16 p-4 rounded-lg items-center border border-blue-600 hover:bg-blue-700 justify-center gap-2.5 inline-flex" onClick={handleApprove}>
              <AiOutlinePlus className="text-white text-base" />
              <div className="text-white text-base font-semibold capitalize leading-loose">Approve</div>
            </button>
          )}
          {!isPast && isApproved && (
            <button className="w-44 h-16 p-4 rounded-lg items-center border border-blue-600 hover:bg-blue-700 justify-center gap-2.5 inline-flex ml-auto" onClick={handleOpenModal}>
              <AiOutlinePlus className="text-white text-base" />
              <div className="text-white text-base font-semibold capitalize leading-loose">Add NFT</div>
            </button>
          )}
        </div>
      </div>
  
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 md:mt-16 gap-y-12 gap-x-28 mb-8">
        {nftComponents}
      </div>
  
      {isModalOpen && <AddNftModal onClose={handleCloseModal} collectionAddress={collectionAddress} marketplaceId={marketplaceId} />}
    </div>
  );
  
};

export default DetailFooter;
