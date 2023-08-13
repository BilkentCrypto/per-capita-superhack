import { useState } from 'react';
import { writeContract, waitForTransaction } from '@wagmi/core';
import contractAddresses from '../utils/addresses.json';
import mainContractAbi from '../utils/MainAbi.json';
import { decodeEventLog, parseEther } from 'viem';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { storeFile, getFile, storeUri } from '../utils/getWeb3';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';


const CreateNewINO = () => {
  const [name, setName] = useState(''); //sets name
  const [description, setDescription] = useState('');
  const [giveawayTime, setGiveawayTime] = useState('');
  const [contractAddr, setContractAddr] = useState('');
  const [price, setPrice] = useState('');

  const [nameRequired, setNameRequired] = useState(false);
  const [descriptionRequired, setDescriptionRequired] = useState(false);
  const [giveawayTimeRequired, setGiveawayTimeRequired] = useState(false);
  const [contractAddrRequired, setContractAddrRequired] = useState(false);
  const [priceRequired, setPriceRequired] = useState(false);


  const [selectedFile, setSelectedFile] = useState();
  const [image, setImage] = useState(null)
  const [isFilePicked, setIsFilePicked] = useState(false);

  const accountData = useAccount();
  const navigate = useNavigate();

  const createNewINO = async () => {

    if(name) setNameRequired(false);
    else setNameRequired(true)

    if(description) setDescriptionRequired(false);
    else setDescriptionRequired(true)

    if(giveawayTime) setGiveawayTimeRequired(false);
    else setGiveawayTimeRequired(true)

    if(contractAddr) setContractAddrRequired(false);
    else setContractAddrRequired(true)

    if(price) setPriceRequired(false);
    else setPriceRequired(true)

    if(name && description && giveawayTime && contractAddr && price) {

    } else {
      enqueueSnackbar('Fill all inputs!', {variant: 'error'});
      return;
    }

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

      enqueueSnackbar('Successfully launched!', {variant: 'success'});

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
      enqueueSnackbar('An error occured!', {variant: 'error'});
      console.log("error on creating new INO!", e);
    }
  }


  const changeHandler = (event) => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setImage(URL.createObjectURL(event.target.files[0]));
      setIsFilePicked(true);
    } else {
      setIsFilePicked(false);
    }

  };

  const handleName = (e) => {
    setNameRequired(false);
    setName(e.target.value);
  };

  const handleDescription = (e) => {
    setDescriptionRequired(false);
    setDescription(e.target.value);
  };

  const handleGiveawayTime = (e) => {
    setGiveawayTimeRequired(false);
    const dateObj = new Date(e.target.value);
    let epochTime = dateObj.getTime();
    epochTime = Math.floor(epochTime / 1000);
    setGiveawayTime(epochTime)
  };

  const handleContract = (e) => {
    setContractAddrRequired(false);
    setContractAddr(e.target.value);
  };

  const handlePrice = (e) => {
    setPriceRequired(false);
    setPrice(parseEther(e.target.value));
  };





  return (
    <div className="h-full pb-12 bg-black">
  <SnackbarProvider/>
      <section className=" flex  items-center justify-center">
        <div className=" mt-20 items-center overflow-hidden shadow-2xl rounded-xl ">
          <div className="bg-gray-800 w-96  p-10 mt-10 border  border-[#7316ff] rounded-xl">
            <div className=" w-full">
              <h1 className="text-xl font-bold text-center text-white pb-2">Launch New <br/> Initial NFT Offering</h1>
            </div>
            <p className="pt-3 text-white">Name of the INO</p>
            <input
              type="text"
              className="block mt-1 p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 
              focus:placeholder-gray-400 required:border-red-600 required:placeholder-red-400"
              placeholder="Project's Name"
              required={nameRequired}
              onChange={(e) => handleName(e)}
            />
            <p className="pt-3 text-white">Description</p>
            <input
              type="text"
              className="block p-2 mt-1 text-white w-full text-sm  bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
              focus:placeholder-gray-400 required:border-red-600 required:placeholder-red-400"
              placeholder="Project's description"
              required={descriptionRequired}
              onChange={(e) => handleDescription(e)}
            />
            <div>
            <p className="pt-3 pb-2 text-white">Image of the INO</p>
              <div class="flex items-center justify-center w-full">
                <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                  {isFilePicked ? (
                    <div className='flex flex-col items-center justify-center'>
                      <img alt="Preview Image"
                        className='h-[200px] object-contain'
                        src={image} />
                    </div>
                  ) : <div class="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span></p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
                  </div>
                  }
                  <input id="dropzone-file" type="file" name="file" class="hidden"
                    onChange={changeHandler}
                  />
                </label>
              </div>

            </div>
            <p className="pt-3 text-white">Giveaway Time</p>
            <input
              type="datetime-local"
              id="meeting-time"
              className="block mt-1 p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
              focus:placeholder-gray-400 required:border-red-600 required:placeholder-red-400"
              label="Giveaway deadline"
              required={giveawayTimeRequired}
              onChange={(e) => handleGiveawayTime(e)}
            />
            <p className="pt-3 text-white">NFT Contract Address</p>
            <input
              type="text"
              className="block mt-1 p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
              focus:placeholder-gray-400 required:border-red-600 required:placeholder-red-400"
              placeholder="Contract Address"
              required={contractAddrRequired}
              onChange={(e) => handleContract(e)}
            />
            <p className="pt-2 text-white">NFT Price (in ETH)</p>

            <input
              type='number'
              className="block mt-1 p-2 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
              focus:placeholder-gray-400 required:border-red-600 required:placeholder-red-400"
              placeholder="Price in ETH"
              required={priceRequired}
              onChange={(e) => handlePrice(e)}
            />

            <button
              onClick={() => createNewINO()}
              className="text-white font-semibold bg-[#7316ff] border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg align-center w-full mt-5"
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

