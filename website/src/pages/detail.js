import { useParams } from 'react-router-dom';
import { useAccount, useContractRead, } from 'wagmi';
import contractAddresses from '../utils/addresses.json';
import mainContractAbi from '../utils/MainAbi.json';
import l1Abi from '../utils/L1Abi.json';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { convertToImage, getFile, getUri } from '../utils/getWeb3';
import { writeContract, readContract, waitForTransaction } from '@wagmi/core';
import TrackEvents from './TrackEvents';
import { decodeAbiParameters, formatEther } from 'viem';
import DetailFooter from '../components/DetailFooter';
import { IDKitWidget } from '@worldcoin/idkit';
import { publicClientL1 } from '../utils/viemClients';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import TrackProof from './TrackProof';
import { CountDownTimer } from '../components/CountdownTimer';
import { generateOpenseaAccountUrl, generateOpenseaCollectionUrl } from '../utils/marketplaceGenerator';


const EventsModal = ({ id, showModal, setShowModal }) => {
  return (
    <>
      {showModal ? (
        <>
          <div
            className="justify-center mt-32  w-[500px] h-[500px] mx-auto items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50"
          >
            <div className="relative ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full h-full bg-gray-700 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5   rounded-t">
                  <h3 className="text-2xl text-white font-semibold">
                    Track Cross Chain Events (VRF Random)
                  </h3>
                  <div className="border-b border-gray-100"></div>

                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    ×
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 text-white flex-auto">
                  <TrackEvents id={id} />
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6  rounded-b">
                  <button
                    className="border-red-500 border hover:bg-red-500 text-white rounded-lg hover:text-white background-transparent font-bold uppercase px-4 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );

}

const ProofEventsModal = ({ address, showModal, setShowModal }) => {
  return (
    <>
      {showModal ? (
        <>
          <div
            className="justify-center mt-32  w-[500px] h-[500px] mx-auto items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50"
          >
            <div className="relative ">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full h-full bg-gray-700 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5   rounded-t">
                  <h3 className="text-2xl text-white font-semibold">
                    Track Cross Chain Events (Personhood Proof)
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    ×
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 text-white flex-auto">
                  <TrackProof participant={address} />
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6  rounded-b">
                  <button
                    className="border-red-500 border hover:bg-red-500 text-white rounded-lg hover:text-white background-transparent font-bold uppercase px-4 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );

}

const Detail = () => {
  const { id } = useParams();
  const { address } = useAccount();

  const [image, setImage] = useState();
  const [shouldGetImage, setGetImage] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);





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

  const balanceRequest = useContractRead({
    address: contractAddresses.Main,
    abi: mainContractAbi,
    functionName: 'balance',
    args: [address],
    watch: true,
  })

  const rewardRequest = useContractRead({
    address: contractAddresses.Main,
    abi: mainContractAbi,
    functionName: 'getExecutorReward',
    args: [id],
    watch: true,
  })


  const requiredGas = requiredGasRequest.data;

  const collectionData = contractRead.data;
  console.log("dataTest", collectionData)
  const balance = balanceRequest.data;

  const giveawayResult = giveawayResultRequest.data;

  const NFTs = fetchNFTsOfMarketplaceRequest.data; //kontrattaki nft'leri buna göre yap

  const participantData = isParticipatedRequest?.data;
  const isParticipated = participantData?.[0];
  const participantNonce = participantData?.[1];
  const isClaimed = participantData?.[2];
  const wantedVerification = participantData?.[3];

  console.log("verificatipn", wantedVerification, isParticipated);

  const executorReward = rewardRequest.data;
  console.log("reward", executorReward)
  console.log("execute button test", requiredGas, collectionData?.giveawayTime < moment().unix(), collectionData?.isDistributed)

  //console.log("data", collectionData)



  const isOwner = collectionData?.owner.toLowerCase() === address?.toLowerCase();

  const getImage = async () => {

    const imgFile = await getFile(collectionData.imageUri);
    setImage(convertToImage(imgFile));
  }

  if (shouldGetImage && collectionData?.imageUri) {
    setGetImage(false);
    getImage();
  }

  const handleBeParticipantMock = async () => {

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
      setShowModal(true);


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

  const withdraw = async () => {

    const { hash } = await writeContract({
      address: contractAddresses.Main,
      abi: mainContractAbi,
      functionName: 'withdraw',
    });

  }

  const navigateToAddress = () => {
    const url = generateOpenseaAccountUrl(collectionData?.owner);
    window.open(url, '_blank', 'noreferrer');
  }

  const onSuccessWorldId = async (data) => {

    console.log("world data", data);

    const unpackedProof = decodeAbiParameters([{ type: 'uint256[8]' }], data.proof)[0];
    const merkleRoot = decodeAbiParameters([{ type: 'uint256' }], data.merkle_root)[0];
    const nullifierHash = decodeAbiParameters([{ type: 'uint256' }], data.nullifier_hash)[0];


    console.log("args", merkleRoot, nullifierHash, unpackedProof)

    const blockNumber = await publicClientL1.getBlockNumber();
    console.log("block number", blockNumber)


    //contract
    const isContractVerified = await publicClientL1.readContract({
      address: contractAddresses.L1,
      abi: l1Abi,
      functionName: 'verifyWorldIdProof',
      args: [id, address, merkleRoot, nullifierHash, unpackedProof],
    })

    console.log("contract verified", isContractVerified);

    if (isContractVerified) {
      enqueueSnackbar('Correct proof!', { variant: 'success' });
      try {
        const { hash } = await writeContract({
          address: contractAddresses.Main,
          abi: mainContractAbi,
          functionName: 'beParticipant',
          args: [id, merkleRoot, nullifierHash, unpackedProof],
          value: collectionData.price,
        });
        setShowProofModal(true);

      } catch (e) {
        enqueueSnackbar('Person already participated!', { variant: 'error' })
      }

    } else {
      enqueueSnackbar('Proof is wrong!', { variant: 'error' });

    }

  }
  console.log("giveaway result", giveawayResult)

  console.log("test", giveawayResult, collectionData?.randomSeed > 0, isClaimed, isParticipated, giveawayResult, NFTs?.length)

  let statusText;
  if (collectionData?.giveawayTime < moment().unix() && !collectionData?.isDistributed) statusText = <span className="font-bold text-yellow-400 text-xl italic">Executable</span>;
  else if (collectionData?.giveawayTime < moment().unix() && collectionData?.isDistributed && collectionData?.randomSeed == 0) statusText = <span className="font-bold text-orange-400 text-xl italic">Pending Random Seed...</span>;
  else if (collectionData?.randomSeed > 0 && !isClaimed && isParticipated && giveawayResult >= NFTs?.length) statusText = <span className="font-bold text-red-500 text-xl italic">Not Won</span>;
  else if (collectionData?.randomSeed > 0 && !isClaimed && isParticipated && giveawayResult < NFTs?.length) statusText = <span className="font-bold text-green-500 text-xl italic">Won NFT!</span>;
  else if (collectionData?.giveawayTime < moment().unix() && collectionData?.isDistributed) statusText = <span className="font-bold text-red-400 text-xl italic">Done</span>;
  else statusText = <span className="font-bold text-green-400 text-xl italic">Active</span>;

  return (
    <section className="w-full min-h-screen bg-black flex justify-center items-center">
      <SnackbarProvider />
      <div className="w-full  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex md:mt-20 mt-20 flex-col md:flex-row gap-4">
          <div className=" p-4 flex items-center justify-center w-full md:w-1/2"> {/* Change to w-full md:w-1/2 */}
            {/* Left Card */}
            <div className="w-[585px] h-[508px] p-2 shadow-md rounded-3xl mx-auto">
              <img
                src={image}
                alt={collectionData?.name}
                className="w-full mt-7 h-full rounded-3xl object-cover"
              />
            </div>

          </div>
          <div className=" mt-15 p-4 flex items-center justify-center w-full md:w-1/2"> {/* Change to w-full md:w-1/2 */}
            {/* Right Card */}
            <div className=" max-w-[585px] w-full h-[485px] rounded-3xl mx-auto p-2 bg-black shadow-md">
              <h1 className="text-white text-5xl font-bold capitalize leading-[63.98px]">{collectionData?.name}</h1>
              <ul className="space-y-2">

                <li className="flex px-1 justify-between py-1">
                  <span className='w-[574px] text-slate-400 text-base font-normal leading-loose'>{collectionData?.description}</span>
                </li>
                <li className="flex flex-col px-1 text-white py-1">
                  <span className="font-bold text-slate-400 ">Collection Status</span>
                  {statusText}
                </li>
                {collectionData?.giveawayTime > moment().unix() &&
                  <li className="flex flex-col px-1 text-white py-1">
                    <span className="font-bold text-slate-400">Remaining Time</span>
                    <span className='text-white text-base font-bold capitalize'><CountDownTimer targetTime={collectionData?.giveawayTime.toString()} /></span>
                  </li>}

                <li className="flex flex-col px-1 text-white py-1">
                  <span className="font-bold text-slate-400 ">Join Price</span>
                  {collectionData && <span className="text-white text-[22px] text-base font-bold capitalize"> {formatEther(collectionData?.price)} ETH</span>}
                </li>

                <li className="flex flex-col px-1 text-white py-1">
                  <span className="font-bold text-slate-200 ">Collection Addres</span>
                  <span className="font-bold italic hover:text-gray-400 text-white block md:inline whitespace-nowrap overflow-hidden overflow-ellipsis">
                    <a href={generateOpenseaCollectionUrl(collectionData?.contractAddress)} target="_blank" rel="noopener noreferrer">
                      {collectionData?.contractAddress}
                    </a>
                  </span>


                </li>
                <li className="flex flex-col px-1 text-white py-1">
                  <span className="text-gray-300 mt-1 italic font-bold">{`${collectionData?.participantNumber} Unique Participants`}</span>
                </li>


                <li className="flex flex-col px-1 py-1 bg-gray-800 rounded-2xl  hover:scale-[1.02] hover:cursor-pointer"
                  onClick={navigateToAddress}
                >
                  <div className="flex items-center">
                    <img
                      src={`https://effigy.im/a/${collectionData?.owner}.png`}
                      alt="Owner's Avatar"
                      className="w-16 h-16 rounded-2xl mb-2 ml-2 mt-2 mr-4"
                    />
                    <div className="flex flex-col overflow-hidden ">
                      <span className="font-bold text-slate-400 ">Owner</span>
                      {isOwner ?
                        <span className="text-slate-200 text-xl truncate font-bold opacity-85 ml-1">You</span> :
                        <span className="text-slate-200 truncate font-semibold opacity-95">{collectionData?.owner}</span>
                      }
                    </div>
                  </div>
                </li>
              </ul>
              <div className="flex items-start gap-5 justify-start mt-5">
                <IDKitWidget
                  app_id="app_staging_2c9d462d4316977be96a258fa730570f" // must be an app set to on-chain
                  action={"bePart_" + id} // solidityEncode the action
                  signal={address} // only for on-chain use cases, this is used to prevent tampering with a message
                  onSuccess={onSuccessWorldId}
                  // no use for handleVerify, so it is removed
                  credential_types={['orb']} // we recommend only allowing orb verification on-chain
                >
                  {({ open }) =>
                    collectionData?.giveawayTime > moment().unix() ? <button
                      onClick={open}
                      disabled={isParticipated || wantedVerification}
                      className="w-[275px] h-16 p-4 bg-blue-600 rounded-lg justify-center items-start gap-2.5 inline-flex text-white hover:bg-indigo-600 text-lg align-center disabled:bg-gray-600 disabled:text-opacity-60"
                    >
                      <span className=" font-semibold">{wantedVerification ? (isParticipated ? "Already Participated" : "Verifying Proof...") : "Join"}</span>
                    </button> : null
                  }
                </IDKitWidget>
                {requiredGas >= 0 && collectionData?.giveawayTime < moment().unix() && !collectionData?.isDistributed ? <button
                  onClick={executeGiveaway}
                  className="flex space-x-2 items-center text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded-3xl text-lg align-center"
                >
                  <span className="font-semibold">Execute</span>
                  {executorReward && <span className="bg-white flex items-center rounded-3xl px-2 py-1">
                    <span className="text-black font-semibold">{formatEther(executorReward)} ETH</span>
                  </span>}
                </button> : null}

                {collectionData && collectionData?.randomSeed > 0 && !isClaimed && isParticipated && giveawayResult >= NFTs?.length ? <button
                  onClick={claimDeposit}
                  className="flex items-center text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded-3xl text-lg align-center"
                >
                  <span className="mr-2 font-semibold">Claim Deposit</span>
                  <span className="bg-white flex items-center rounded-3xl px-2 py-1">
                    <span className="text-black font-semibold">{formatEther(collectionData?.price)} ETH</span>
                  </span>
                </button> : null}

                {giveawayResult?.toString() && collectionData?.randomSeed > 0 && !isClaimed && isParticipated && giveawayResult < NFTs?.length ? <button
                  onClick={claimNFT}
                  className="flex items-center text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded-3xl text-lg align-center"
                >
                  <span className="mr-2 font-semibold">Claim NFT</span>

                </button> : null}

                {collectionData?.owner == address && collectionData?.randomSeed > 0 && balance > 0 ? <button
                  onClick={withdraw}
                  className="flex items-center text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded-3xl text-lg align-center"
                >
                  <span className="mr-2 font-semibold">Withdraw Deposits</span>
                  <span className="bg-white flex items-center rounded-3xl px-2 py-1">
                    <span className="text-black font-semibold">{formatEther(balance)} eth</span>
                  </span>
                </button> : null}

                <EventsModal id={id} showModal={showModal} setShowModal={setShowModal} />
                <ProofEventsModal address={address} showModal={showProofModal} setShowModal={setShowProofModal} />
              </div>

            </div>

          </div>
        </div>

        <div className="flex justify-center mt-72 space-x-4 md:mt-72">
          <DetailFooter isPast={collectionData?.giveawayTime < moment().unix()} giveawayResult={giveawayResult} collectionAddress={collectionData?.contractAddress} marketplaceId={id} nftIds={NFTs} nftNumber={`40`} isOwner={isOwner} />
        </div>


      </div>
    </section>
  );
};

export default Detail;
