import { useState } from 'react';
import { writeContract } from '@wagmi/core';
import contractAddresses from '../utils/addresses.json';
import mainContractAbi from '../utils/MainAbi.json';
import { parseEther } from 'viem';

const CreateNewNIO = () => {
  const [marketplaceURI, setMarketplaceURI] = useState(''); //sets name
  const [description, setDescription] = useState('');
  const [giveawayTime, setGiveawayTime] = useState('');
  const [contractAddr, setContractAddr] = useState('');
  const [price, setPrice] = useState('');
  const [to, setTo] = useState('');

  const createNewINO = async () => {
    try {
      const { hash } = await writeContract({
        address: contractAddresses.Main,
        abi: mainContractAbi,
        functionName: 'createGiveawayMarketplace',
        args: [
          marketplaceURI,
          description,
          giveawayTime,
          contractAddr,
          price,
          to
        ]
      });
      console.log(hash);
    } catch (e) {
      console.log(marketplaceURI)
      console.log("error on creating new INO!", e);
    }
  }

  const handleMarketplace = (e) => {
    setMarketplaceURI(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleGiveawayTime = (e) => {
    setGiveawayTime(e.target.value);
    var dateObj = new Date(giveawayTime);
    var epochTime = dateObj.getTime();
    epochTime = Math.floor(epochTime / 1000);
    console.log(epochTime);
  };

  const handleContract = (e) => {
    setContractAddr(e.target.value);
  };

  const handlePrice = (e) => {
    setPrice(parseEther(e.target.value));
  };

  const handleTo = (e) => {
    setTo(e.target.value);
  };


  return (
    <section className=" flex w- items-center justify-center">
      <div className=" mt-20  items-center overflow-hidden shadow-2xl border-2 border-gray-100 rounded-xl mb-5">
        <div className="p-10">
          <div className="border-b w-full">
            <h1 className="text-xl font-bold text-center pb-2">Create New INO</h1>
          </div>
          <p className="pt-3">Name of the Project</p>
          <input
            type="text"
            className="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Project's Name"
            required
            onChange={(e) => handleMarketplace(e)}
          />
          <p className="pt-3">Description</p>
          <input
            type="text"
            className="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Project's description"
            required
            onChange={(e) => handleDescription(e)}
          />
          <p className="pt-3">Giveaway Time</p>
          <input
            type="datetime-local" 
            id="meeting-time"
            className="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            label="Giveaway deadline"
            required
            onChange={(e) => handleGiveawayTime(e)}
          />
          <p className="pt-3">NFT Contract Address</p>
          <input
            type="text"
            className="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Contract Address"
            required
            onChange={(e) => handleContract(e)}
          />
          <p className="pt-2 font">NFT Price (in ETH)</p>

          <input
            type="text"
            className="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Price in ETH"
            required
            onChange={(e) => handlePrice(e)}
          />

          <p className="pt-2 font">Fund Collector address</p>

          <input
            type="text"
            className="block p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Funded Address"
            required
            onChange={(e) => handleTo(e)}
          />
          <button
            onClick={() => createNewINO()}
            className="text-white bg-[#7316ff] border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg align-center w-full mt-5"
          >
            Create
          </button>
        </div>
      </div>
    </section>
  );
};

export default CreateNewNIO;

