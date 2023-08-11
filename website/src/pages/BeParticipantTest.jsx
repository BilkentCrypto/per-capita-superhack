import { IDKitWidget, solidityEncode } from '@worldcoin/idkit'
import { useAccount } from 'wagmi';
import contractAddresses from '../utils/addresses.json';
import mainContractAbi from '../utils/MainAbi.json';
import l1Abi from '../utils/L1Abi.json';
import worldIdAbi from'../utils/worldIdAbi.json';
import { useEffect, useState } from 'react';
import { writeContract, readContract, waitForTransaction } from '@wagmi/core';
import { encodeAbiParameters, encodePacked, decodeAbiParameters, parseEther, keccak256 } from 'viem'
import { publicClientL1 } from '../utils/viemClients';


export const BeParticipantTest = () => {

    const { address, isConnecting, isDisconnected } = useAccount()

    const marketplaceId = 8;

const onSuccess = async (data) => {
    
console.log("world data", data);

const unpackedProof = decodeAbiParameters([{ type: 'uint256[8]' }], data.proof)[0];
const merkleRoot = decodeAbiParameters([{type: 'uint256'}], data.merkle_root)[0];
const nullifierHash = decodeAbiParameters([{type: 'uint256'}], data.nullifier_hash)[0];


console.log("args", merkleRoot, nullifierHash, unpackedProof)

const blockNumber = await publicClientL1.getBlockNumber();
console.log("block number", blockNumber)



//contract
const isContractVerified = await publicClientL1.readContract({
    address: contractAddresses.proofTestMain,
    abi: l1Abi,
    functionName: 'verifyWorldIdProof',
    args: [marketplaceId, address, merkleRoot, nullifierHash, unpackedProof],
  })

  console.log("contract verified", isContractVerified);

}

    return(
<div>
<IDKitWidget
    app_id="app_staging_2c9d462d4316977be96a258fa730570f" // must be an app set to on-chain
    action={"bePart_" + marketplaceId} // solidityEncode the action
    signal={address} // only for on-chain use cases, this is used to prevent tampering with a message
    onSuccess={onSuccess}
    // no use for handleVerify, so it is removed
    credential_types={['orb']} // we recommend only allowing orb verification on-chain

    >
 {({ open }) => <button onClick={open}>Verify with World ID</button>}
 </IDKitWidget>
</div>

    );

}