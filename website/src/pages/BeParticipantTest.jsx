import { IDKitWidget, solidityEncode } from '@worldcoin/idkit'
import { useAccount } from 'wagmi';
import contractAddresses from '../utils/addresses.json';
import mainContractAbi from '../utils/MainAbi.json';
import worldIdAbi from'../utils/worldIdAbi.json';
import { useEffect, useState } from 'react';
import { writeContract, readContract, waitForTransaction } from '@wagmi/core';
import { encodeAbiParameters,decodeAbiParameters, parseEther, keccak256 } from 'viem'
import { publicClientL1 } from '../utils/viemClients';


export const BeParticipantTest = () => {

    const { address, isConnecting, isDisconnected } = useAccount()

const onSuccess = async (data) => {
    
console.log("world data", data);

const unpackedProof = decodeAbiParameters([{ type: 'uint256[8]' }], data.proof)[0];
const merkleRoot = decodeAbiParameters([{type: 'uint256'}], data.merkle_root)[0];
const nullifierHash = decodeAbiParameters([{type: 'uint256'}], data.nullifier_hash)[0];

const signalEncoded = encodeAbiParameters([
    { name: 'x', type: 'address' },
  ],
  [address]
);

const externalHashEncoded = encodeAbiParameters([
    { name: 'x', type: 'address' },
    { name: 'y', type: 'uint256' },
  ],
  [contractAddresses.Main, 1]
);

console.log("args", merkleRoot, nullifierHash, unpackedProof)

const blockNumber = await publicClientL1.getBlockNumber();
console.log("block number", blockNumber)
/*
const isVerified = await publicClientL1.readContract({
    address: contractAddresses.worldId,
    abi: worldIdAbi,
    functionName: 'verifyProof',
    args: [merkleRoot, 1, keccak256(address), nullifierHash, keccak256(externalHashEncoded), unpackedProof],
  })
*/

const isVerified = await publicClientL1.readContract({
    address: contractAddresses.proofTestMain,
    abi: mainContractAbi,
    functionName: 'verifyTest',
    args: [1, merkleRoot, nullifierHash, unpackedProof],
  })

  console.log("verified", isVerified);

}

    return(
<div>
<IDKitWidget
    app_id="app_staging_2c9d462d4316977be96a258fa730570f" // must be an app set to on-chain
    action={solidityEncode(['address', 'uint256'], [contractAddresses.Main, 1])} // solidityEncode the action
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