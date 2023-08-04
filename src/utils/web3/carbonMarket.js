import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const address = "0x0Ce1BB5c347154678B55bB2F8A04b6a1C6724268";
const fracAbi = [
    "function fractionizeNft(uint256 nftId)"
];

export const fractionizeNft = async (_id) => {
  const signer = provider.getSigner();
	const contract = new ethers.Contract(address, fracAbi, signer);   
	const tx = await contract.fractionizeNft(_id);


	const receipt = await tx.wait();
	console.log("receipt", receipt);
}

const getNFTAbi = [
    "function getNftList() view returns (uint256[])"
  ];
  
export const getNftList = async() => {
    const signer = provider.getSigner();

    const contract = new ethers.Contract(address, getNFTAbi, signer);   
    const result = await contract.getNftList();

    console.log("result", result);
    return result;
}


const retireNftabi = [
    "function retireNft(uint256 nftId) payable"
  ];
  
  export const retireNft = async(nftId) => {
    const signer = provider.getSigner();
    const options = {value: ethers.utils.parseEther("0")}
      const contract = new ethers.Contract(address, retireNftabi, signer);   
      console.log("NFT ID:" + nftId);
      const tx = await contract.functions.retireNft(nftId ,options);
       
      const receipt = await tx.wait();
      console.log("receipt", receipt);
  }
  