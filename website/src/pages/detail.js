import { useParams } from 'react-router-dom';
import { useAccount, useContractRead } from 'wagmi';
import contractAddresses from '../utils/addresses.json';
import mainContractAbi from '../utils/MainAbi.json';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { convertToImage, getFile, getUri } from '../utils/getWeb3';
import { writeContract, readContract, waitForTransaction } from '@wagmi/core';
import TrackEvents from './TrackEvents';
import { formatEther } from 'viem';
import DetailFooter from '../components/DetailFooter';
import Image from '../assets/Image.png'

const EventsModal = ({ id }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        className="w-[275px] h-16 p-4 font-semibold bg-purple-600 hover:bg-purple-700  rounded-lg border text-white border-blue-600 justify-center items-start gap-2.5 inline-flex"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Open regular modal
      </button>
      {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Modal Title
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <TrackEvents id={id} />
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}

const Detail = () => {
  const { id } = useParams();
  const { address } = useAccount();


  const contractRead = useContractRead({
    address: contractAddresses.Main,
    abi: mainContractAbi,
    functionName: 'fetchMarketplace',
    args: [id],
    watch: true,
  })

  const isParticipatedRequest = useContractRead({
    address: contractAddresses.Main,
    abi: mainContractAbi,
    functionName: 'participants',
    args: [id, address],
    watch: true,
  })

  const giveawayResultRequest = useContractRead({
    address: contractAddresses.Main,
    abi: mainContractAbi,
    functionName: 'getGiveawayResult',
    args: [id, address],
    watch: true,
  })

  const fetchNFTsOfMarketplaceRequest = useContractRead({
    address: contractAddresses.Main,
    abi: mainContractAbi,
    functionName: 'fetchNFTsOfMarketplace',
    args: [id],
    watch: true,
  })


  const requiredGasRequest = useContractRead({
    address: contractAddresses.Main,
    abi: mainContractAbi,
    functionName: 'getRequiredGasForHyperlane',
  })

  const requiredGas = requiredGasRequest.data;

  const collectionData = contractRead.data;


  const giveawayResult = giveawayResultRequest.data;

  const NFTs = fetchNFTsOfMarketplaceRequest.data;

  const participantData = isParticipatedRequest?.data;
  const isParticipated = participantData?.[0];
  const participantNonce = participantData?.[1];
  const isClaimed = participantData?.[2];

  //console.log("data", collectionData)


  const [image, setImage] = useState();
  const [shouldGetImage, setGetImage] = useState(true);

  const getImage = async () => {

    const imgFile = await getFile(collectionData.imageUri);
    setImage(convertToImage(imgFile));
  }

  if (shouldGetImage && collectionData?.imageUri) {
    setGetImage(false);
    getImage();
  }

  const handleBeParticipant = async () => {

    const { hash } = await writeContract({
      address: contractAddresses.Main,
      abi: mainContractAbi,
      functionName: 'beParticipantMock',
      args: [id],
      value: collectionData.price,
    });

  }


  const executeGiveaway = async () => {
    try {
      const requiredGas = await readContract({
        address: contractAddresses.Main,
        abi: mainContractAbi,
        functionName: 'getRequiredGasForHyperlane'
      })

      const { hash } = await writeContract({
        address: contractAddresses.Main,
        abi: mainContractAbi,
        functionName: 'executeGiveaway',
        args: [id],
        value: requiredGas,
      });

      console.log("hash", hash);
    } catch (e) {
      console.log("error on write", e);
    }

  }

  const claimDeposit = async () => {

    const { hash } = await writeContract({
      address: contractAddresses.Main,
      abi: mainContractAbi,
      functionName: 'claimPrice',
      args: [id],
    });

  }

  const claimNFT = async () => {

    const { hash } = await writeContract({
      address: contractAddresses.Main,
      abi: mainContractAbi,
      functionName: 'claimNFT',
      args: [id],
    });

  }




  return (
    <section className="w-full min-h-screen bg-black flex justify-center items-center">
      <div className="w-full  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex md:mt-20 mt-20 flex-col md:flex-row gap-4">
          <div className=" p-4 flex items-center justify-center w-full md:w-1/2"> {/* Change to w-full md:w-1/2 */}
            {/* Left Card */}
            <div className="w-[585px] h-[508px] p-2 shadow-md rounded-3xl mx-auto">
              <img
                src={Image} // Reduced image size to 200x200
                alt={collectionData?.name}
                className="w-full h-full rounded-3xl object-contain"
              />
            </div>

          </div>
          <div className=" mt-15 p-4 flex items-center justify-center w-full md:w-1/2"> {/* Change to w-full md:w-1/2 */}
            {/* Right Card */}
            <div className=" max-w-[585px] w-full h-[485px] rounded-3xl mx-auto p-2 bg-black shadow-md">
              <h1 className="text-white text-5xl font-bold capitalize leading-[63.98px]">Collection #{id}</h1>
              <ul className="space-y-2">
                <li className="px-1 flex justify-between py-2">
                  <span className='text-white text-2xl font-bold'>{collectionData?.name}</span>
                </li>
                <li className="flex px-1 justify-between py-1">
                  <span className='w-[574px] text-slate-400 text-base font-normal leading-loose'>{collectionData?.description}</span>
                </li>
                <li className="flex flex-col px-1 text-white py-1">
                  <span className="font-bold text-slate-400">Remaining Time</span>
                  <span>{moment.unix(collectionData?.giveawayTime.toString()).toString()}</span>
                </li>
                
                <li className="flex flex-col px-1 text-white py-1">
                  <span className="font-bold text-slate-400 ">Join Price</span>
                  { collectionData && <span className="text-white font-semibold"> {formatEther(collectionData?.price)} ETH</span> }
                </li>

              </ul>
              <div className="flex items-start gap-5 justify-start mt-5">
                {!isParticipated && collectionData?.giveawayTime > moment().unix() ? <button
                  onClick={handleBeParticipant}
                  className="w-[275px] h-16 p-4 bg-blue-600 rounded-lg justify-center items-start gap-2.5 inline-flex text-white hover:bg-indigo-600 text-lg align-center"
                >
                  <span className=" font-semibold">Join</span>
                
                </button> : null}

                { requiredGas && collectionData?.giveawayTime < moment().unix() && !collectionData?.isDistributed ? <button
                  onClick={executeGiveaway}
                  className="flex items-center text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded-3xl text-lg align-center"
                >
                  <span className="mr-2 font-semibold">Execute</span>
                  <span className="bg-white flex items-center rounded-3xl px-2 py-1">
                    <span className="text-black font-semibold">{formatEther(requiredGas)} ETH</span>
                  </span>
                </button> : null}

                { collectionData && collectionData?.randomSeed > 0 && !isClaimed && isParticipated && giveawayResult >= NFTs?.length ? <button
                  onClick={claimDeposit}
                  className="flex items-center text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded-3xl text-lg align-center"
                >
                  <span className="mr-2 font-semibold">Claim Deposit</span>
                  <span className="bg-white flex items-center rounded-3xl px-2 py-1">
                    <span className="text-black font-semibold">{formatEther(collectionData?.price)} ETH</span>
                  </span>
                </button> : null}

                {giveawayResult && collectionData?.randomSeed > 0 && !isClaimed && isParticipated && giveawayResult < NFTs?.length ? <button
                  onClick={claimDeposit}
                  className="flex items-center text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded-3xl text-lg align-center"
                >
                  <span className="mr-2 font-semibold">Claim NFT</span>
                  <span className="bg-white flex items-center rounded-3xl px-2 py-1">
                    <span className="text-black font-semibold">{giveawayResult?.toString()} eth</span>
                  </span>
                </button> : null}

                <EventsModal id={id} />
              </div>
             
            </div>

          </div>
        </div> 
        
        <div className="flex justify-center  space-x-4 md:mt-20">
            <DetailFooter collectionAddress={collectionData.contractAddress}/>
            </div>
      </div>
    </section>
  );
};

export default Detail;
