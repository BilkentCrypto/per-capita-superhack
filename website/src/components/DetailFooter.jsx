import React, { useEffect, useState } from 'react';
import NftCard from './NftCard';
import { AiOutlinePlus } from 'react-icons/ai';
import AddNftModal from './AddNftModal'; 
import { useContractRead, useAccount, erc721ABI } from 'wagmi';
import contractAddresses from '../utils/addresses.json';
import mainContractAbi from '../utils/MainAbi.json';
import { writeContract } from '@wagmi/core'
import { generateOpenseaCollectionUrl, generateOpenseaUrl } from '../utils/marketplaceGenerator';
import zdk from '../utils/zdk';
import { getImageUrl } from '../utils/getWeb3';

const DetailFooter = ({collectionAddress, nftIds, marketplaceId, isPast, isOwner, giveawayResult}) => {
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

    const options = {method: 'GET', headers: {accept: 'application/json'}};
    const nftMetadatas = await Promise.all (nftIds.map( async (value) => {
      const nftMetadata = await (await fetch(`https://testnets-api.opensea.io/v2/chain/zora_testnet/contract/${collectionAddress}/nfts/${value}`, options)).json();
      return nftMetadata

    } ));

    nftMetadatas.sort( (a, b) => a.nft.identifier - b.nft.identifier );

    const newNfts = nftMetadatas.map( value => {
      return {
        tokenId: value.nft.identifier,
        title: value.nft.name,
        imageUrl: value.nft.image_url,
      }
    } ) 

    console.log("formatted nfts", newNfts);
    setNfts(newNfts);

  }
  useEffect( () => {
 
    const interval = setInterval(() => {
      fetchNfts();
    }, 7000);
  
return () => {
  clearInterval(interval);
}
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
    return <NftCard isWinner={index === Number(giveawayResult)} key={value.tokenId} onClick={() => handleImageClick(value.tokenId)} title={value.title} imageUrl={value.imageUrl} index={index}/>
  } )

  return (
    <div className="flex flex-col w-full items-left bg-black py-4 px-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-white text-3xl font-bold">
          All NFTs [{nftIds?.length}]
        </div>
        <div className="flex items-center">
          {!isPast && !isApproved && isOwner && (
            <button className="w-44 h-16 p-4 rounded-lg items-center border border-blue-600 hover:bg-blue-700 justify-center gap-2.5 inline-flex" onClick={handleApprove}>
              <AiOutlinePlus className="text-white text-base" />
              <div className="text-white text-base font-semibold capitalize leading-loose">Approve</div>
            </button>
          )}
          {!isPast && isApproved && isOwner && (
            <button className="w-44 h-16 p-4 rounded-lg items-center border border-blue-600 hover:bg-blue-700 justify-center gap-2.5 inline-flex ml-auto" onClick={handleOpenModal}>
              <AiOutlinePlus className="text-white text-base" />
              <div className="text-white text-base font-semibold capitalize leading-loose">Add NFT</div>
            </button>
          )}
        </div>
      </div>
  
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 md:mt-16 gap-y-12 gap-x-20 mb-8">
        {nftComponents}
      </div>
  
      {isModalOpen && <AddNftModal onClose={handleCloseModal} collectionAddress={collectionAddress} marketplaceId={marketplaceId} />}
    </div>
  );
  
};

export default DetailFooter;
