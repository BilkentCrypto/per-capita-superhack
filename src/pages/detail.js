import { useParams } from 'react-router-dom';
import { useAccount, useContractRead } from 'wagmi';
import contractAddresses from '../utils/addresses.json';
import mainContractAbi from '../utils/MainAbi.json';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { convertToImage, getFile, getUri } from '../utils/getWeb3';
import { writeContract, readContract, waitForTransaction } from '@wagmi/core';

const Detail = () => {
  const { id } = useParams();
  const {address} = useAccount();

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

    const collectionData = contractRead.data;
    const isParticipated = isParticipatedRequest?.data?.[0];
console.log("?", isParticipated, collectionData)

console.log("data", collectionData)

 
const [image, setImage] = useState();
const [shouldGetImage, setGetImage] = useState(true);

const getImage = async () => {
  
  const imgFile = await getFile(collectionData.imageUri);
  setImage( convertToImage(imgFile) );
}

if(shouldGetImage && collectionData?.imageUri) {
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


  return (
    <section className="w-full min-h-screen flex justify-center items-center">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className=" p-4 flex items-center justify-center w-full md:w-1/2"> {/* Change to w-full md:w-1/2 */}
            {/* Left Card */}
            <div className="w-48 md:w-56 mt-8 p-2 bg-white shadow-md rounded-lg mx-auto">
              <img
                src={image} // Reduced image size to 200x200
                alt={collectionData?.name}
                className="w-full h-48 md:h-56 object-cover rounded-t-lg"
              />
            </div>
          </div>
          <div className=" p-4 flex items-center justify-center w-full md:w-1/2"> {/* Change to w-full md:w-1/2 */}
            {/* Right Card */}
            <div className="w-full p-4 bg-white shadow-md rounded-lg">
              <h1 className="text-xl font-bold text-center mb-4">Collection #{id}</h1>
              <ul className="space-y-2">
                <li className="flex justify-between py-2">
                  <span className="font-bold">Name:</span>
                  <span>{collectionData?.name}</span>
                </li>
                <li className="flex justify-between py-2">
                  <span className="font-bold">Description:</span>
                  <span>{collectionData?.description}</span>
                </li>
                <li className="flex justify-between py-2">
                  <span className="font-bold">Remaining Time:</span>
                  <span>{collectionData?.giveawayTime}</span>
                </li>
              </ul>
              <div className="flex items-center justify-center mt-5">
                { !isParticipated &&  collectionData?.giveawayTime > moment().unix() ? <button
                  onClick={handleBeParticipant}
                  className="flex items-center text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded-3xl text-lg align-center"
                > 
                  <span className="mr-2 font-semibold">Join</span>
                  <span className="bg-white flex items-center rounded-3xl px-2 py-1">
                    <span className="text-black font-semibold">20$</span>
                  </span>
                </button> : null}

                { collectionData?.giveawayTime < moment().unix() && !collectionData?.isDistributed ? <button
                  onClick={executeGiveaway}
                  className="flex items-center text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded-3xl text-lg align-center"
                > 
                  <span className="mr-2 font-semibold">Execute</span>
                  <span className="bg-white flex items-center rounded-3xl px-2 py-1">
                    <span className="text-black font-semibold">20$</span>
                  </span>
                </button> : null}
              </div>
            
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Detail;
