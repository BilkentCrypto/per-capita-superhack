//import { watchEvent } from "viem/dist/types/actions/public/watchEvent";
import { useState, useEffect } from "react";
import { createPublicClient, http, parseAbiItem } from "viem";
import { optimismGoerli, goerli } from "viem/chains";
import contractAddresses from '../utils/addresses.json';

const TrackEvents = () => {
    const [vrfRequestSentL1, setVrfRequestSentL1] = useState('Not Done');
    const [vrfRequestL1, setVrfRequestL1] = useState('Not Done');
    const [randomGenerated, setRandomGenerated] = useState('Not Done');
    const [randomSentToL2, setRandomSentToL2] = useState('Not Done');
    const [giveawayDone, setGiveawayDone] = useState('Not Done');

    //const L1Hyperlane = "0xD45b26D61c41D731adCd661831CEc173D23A4012";
    //const L2Hyperlane = "0x3A51C234065016fD1612856b5456e7164858768e";
    //const L2Main = "0xad8aa0918B2aE001762a233fF4283F2C2A2a1479";

    const publicClient = createPublicClient({
        chain: optimismGoerli,
        transport: http()
    });

    const publicClientGoerli = createPublicClient({
        chain: goerli,
        transport: http()
    });

    //Event Flow: Randomness Request sent to L1 -> Randomness Requested from Chainlink
    // ->Randomness Generated, waiting for Automation -> Randomness Sent to L2 -> Giveaway Executed.

    const RandomnessRequestSentToL1 = 'event RandomnessRequestSentToL1(uint256 indexed collectionId)';
    const RandomnessRequestedFromVRF = 'event RandomNumberRequested(uint indexed collectionId)';
    const RandomnessGenerated = 'event RandomNumberGenerated(uint indexed collectionId)';
    const RandomnessSentToL2 = 'event RandomSentToL2(uint indexed collectionId)';
    const GiveawayDone = 'event GiveawayExecuted(uint256 indexed collectionId)';

    // ********** EVENT TRACKING **********

    const marketplaceID = 2; //TAKE THIS AS A PARAMETER IN DETAILS PAGE!

    const requestToL1 = publicClient.watchEvent({
        address: contractAddresses.L2,
        event: parseAbiItem(RandomnessRequestSentToL1),
        args: {
            collectionId: marketplaceID
        },
        onLogs: logs => {
            console.log("Randomness requested from Chainlink: ",logs);
            setVrfRequestL1('Done');
        }
    });

    const randomnessRequested = publicClientGoerli.watchEvent({
        address: contractAddresses.L1,
        event: parseAbiItem(RandomnessRequestedFromVRF),
        args: {
            collectionId: marketplaceID
        },
        onLogs: logs => {
            console.log("Request To L1 complete.",logs);
            setVrfRequestSentL1('Done');
        }
    });

    const randomnessGenerated = publicClientGoerli.watchEvent({
        address: contractAddresses.L1,
        event: parseAbiItem(RandomnessGenerated),
        args: {
            collectionId: marketplaceID
        },
        onLogs: logs => {
            console.log("Randomness Generated:",logs);
            setRandomGenerated('Done');
        }
    });

    const randomnessSentL2 = publicClientGoerli.watchEvent({
        address: contractAddresses.L1,
        event: parseAbiItem(RandomnessSentToL2),
        args: {
            collectionId: marketplaceID
        },
        onLogs: logs => {
            console.log("Randomness Sent To L2:",logs);
            setRandomSentToL2('Done');
        }
    });

    const giveawayFinished = publicClient.watchEvent({
        address: contractAddresses.L1,
        event: parseAbiItem(GiveawayDone),
        args: {
            collectionId: marketplaceID
        },
        onLogs: logs => {
            console.log("Giveaway Done",logs);
            setGiveawayDone('Done');
        }
    });

    useEffect(() => {
        requestToL1();
        randomnessRequested();
        randomnessGenerated();
        randomnessSentL2();
        giveawayFinished();

        return () => {
            requestToL1();
            randomnessRequested();
            randomnessGenerated();
            randomnessSentL2();
            giveawayFinished();
        }
      }, []); 

    return (
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-4 justify-center">
            <span className="text-2xl text-black">vrfRequestSentL1: {vrfRequestSentL1}</span>
            <span className="text-2xl text-black">VRF Requested from Chainlink: {vrfRequestL1}</span>
            <span className="text-2xl text-black">Randomness Generated: {randomGenerated}</span>
            <span className="text-2xl text-black">Random Sent To L1: {randomSentToL2}</span>
            <span className="text-2xl text-black">Giveaway Result: {giveawayDone}</span>
          </div>
        </div>
      );
}

export default TrackEvents;