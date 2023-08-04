import { ethers, BigNumber } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const address = "0x3C891Bb8159A7C9739F6c5b77deCFF129ddF03aB";
const mintAbi = [
    "function mintCertificate(uint256 carbon, uint256 _cerfId)"
];

export const mintCertificate = async (amount, certificate) => {
    const signer = provider.getSigner();

    const contract = new ethers.Contract(address, mintAbi, signer);
	const tx = await contract.functions.mintCertificate(BigNumber.from(amount), BigNumber.from(certificate));

	const receipt = await tx.wait();
	console.log("receipt", receipt);
}

const approveAbi = [
    "function setApprovalForAll(address operator, bool approved)"
]

export const approval = async (_address) => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, approveAbi, signer);   

    const tx = await contract.setApprovalForAll(_address, true);
    console.log(_address)
    console.log(tx)
    const receipt = await tx.wait();
	console.log("receipt", receipt);
}

const valueAbi = [
    "function tokenToValue(uint256) view returns (uint256)"
];
  
export const tokenToValue = async (_id) => {
    const signer = provider.getSigner();

    const contract = new ethers.Contract(address, valueAbi, signer);   
    const result = await contract.functions.tokenToValue(BigNumber.from(_id));

    console.log("result", result);
    return result
}
