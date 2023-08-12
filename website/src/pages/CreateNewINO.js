import { useState } from 'react';
import { writeContract, waitForTransaction } from '@wagmi/core';
import contractAddresses from '../utils/addresses.json';
import mainContractAbi from '../utils/MainAbi.json';
import { decodeEventLog, parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { storeFile, getFile, storeUri } from '../utils/getWeb3';

import DatePicker from 'react-datepicker';

const CreateNewINO = () => {
  const [name, setName] = useState(''); //sets name
  const [description, setDescription] = useState('');
  const [giveawayTime, setGiveawayTime] = useState('');
  const [contractAddr, setContractAddr] = useState('');
  const [price, setPrice] = useState('');


  const [selectedFile, setSelectedFile] = useState();
  const [image, setImage] = useState(null)
  const [isFilePicked, setIsFilePicked] = useState(false);

  const accountData = useAccount();
  const navigate = useNavigate();

  const createNewINO = async () => {
    try {

      const imageCid = await storeFile(selectedFile)

      const { hash } = await writeContract({
        address: contractAddresses.Main,
        abi: mainContractAbi,
        functionName: 'createGiveawayMarketplace',
        args: [
          imageCid,
          name,
          description,
          giveawayTime,
          contractAddr,
          price,
          accountData.address
        ]
      });
      console.log(hash);
      const transactionResult = await waitForTransaction({
        hash: hash,
      })


      const topic = decodeEventLog({
        abi: mainContractAbi,
        data: transactionResult.logs[0].data,
        topics: transactionResult.logs[0].topics
      });
      const id = topic.args.collectionId;
      navigate(`/detail/${id}`)

    } catch (e) {
      console.log("error on creating new INO!", e);
    }
  }

  
  const changeHandler = (event) => {
      setSelectedFile(event.target.files[0]);
      setImage(URL.createObjectURL(event.target.files[0]));
      setIsFilePicked(true);
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handleGiveawayTime = (e) => {
    const dateObj = new Date(e.target.value);
    let epochTime = dateObj.getTime();
    epochTime = Math.floor(epochTime / 1000);
    setGiveawayTime(epochTime)
  };

  const handleContract = (e) => {
    setContractAddr(e.target.value);
  };

  const handlePrice = (e) => {
    setPrice(parseEther(e.target.value));
  };





  return (
    <div className="h-screen bg-black">

    <section className=" flex  items-center justify-center">
      <div className="  mt-20 items-center overflow-hidden shadow-2xl rounded-xl ">
        <div className="bg-gray-800  p-10 mt-10 border  border-[#7316ff] rounded-xl">
          <div className=" w-full">
            <h1 className="text-xl font-bold text-center text-white pb-2">Create New INO</h1>
          </div>
          <p className="pt-3 text-white">Name of the Project</p>
          <input
            type="text"
            className="block mt-1 p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Project's Name"
            required
            onChange={(e) => handleName(e)}
          />
          <p className="pt-3 text-white">Description</p>
          <input
            type="text"
            className="block p-2 mt-1 text-white w-full text-sm  bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Project's description"
            required
            onChange={(e) => handleDescription(e)}
          />
          <div>
            <input type="file" name="file" onChange={changeHandler} />
            {isFilePicked ? (
              <div className='flex flex-col items-center justify-center'>
                <p>Filename: {selectedFile.name}</p>
                <img alt="Preview Image" 
                className='h-[200px] object-contain' 
                src={image} />
              </div>
            ) : (
              <p className='text-white'>Please select a file</p>
            )}
          </div>
          <p className="pt-3 text-white">Giveaway Time</p>
          <input
            type="datetime-local"
            id="meeting-time"
            className="block mt-1 p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            label="Giveaway deadline"
            required
            onChange={(e) => handleGiveawayTime(e)}
          />
          <p className="pt-3 text-white">NFT Contract Address</p>
          <input
            type="text"
            className="block mt-1 p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Contract Address"
            required
            onChange={(e) => handleContract(e)}
          />
          <p className="pt-2 text-white">NFT Price (in ETH)</p>

          <input
            type="text"
            className="block mt-1 p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Price in ETH"
            required
            onChange={(e) => handlePrice(e)}
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
    </div>
  );
};

export default CreateNewINO;

