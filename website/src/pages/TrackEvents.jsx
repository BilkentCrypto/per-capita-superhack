//import { watchEvent } from "viem/dist/types/actions/public/watchEvent";
import { useState, useEffect } from "react";
import { createPublicClient, http, parseAbiItem } from "viem";
import { optimismGoerli, goerli } from "viem/chains";
import { readContract, writeContract, watchContractEvent } from '@wagmi/core';
import contractAddresses from '../utils/addresses.json';
import mainContractAbi from '../utils/MainAbi.json';
import { publicClientL1, publicClientL2 } from "../utils/viemClients";
import moment from "moment";

const L1Explorer = "https://goerli.etherscan.io/tx/";
const L2Explorer = "https://goerli-optimism.etherscan.io/tx/";

const TrackEvents = ({id}) => {
  const [vrfRequestL1, setVrfRequestL1] = useState();
  const [vrfRequestSentL1, setVrfRequestSentL1] = useState();
  const [randomGenerated, setRandomGenerated] = useState();
  const [randomSentToL2, setRandomSentToL2] = useState();
  const [giveawayDone, setGiveawayDone] = useState();

  const marketplaceID = id ? id : 733 ;

  //const L1Hyperlane = "0xD45b26D61c41D731adCd661831CEc173D23A4012";
  //const L2Hyperlane = "0x3A51C234065016fD1612856b5456e7164858768e";
  //const L2Main = "0xad8aa0918B2aE001762a233fF4283F2C2A2a1479";

  //Event Flow: Randomness Request sent to L1 -> Randomness Requested from Chainlink
  // ->Randomness Generated, waiting for Automation -> Randomness Sent to L2 -> Giveaway Executed.

  const RandomnessRequestSentToL1 = 'event RandomnessRequestSentToL1(uint256 indexed collectionId)';
  const RandomnessRequestedFromVRF = 'event RandomNumberRequested(uint indexed collectionId)';
  const RandomnessGenerated = 'event RandomNumberGenerated(uint indexed collectionId)';
  const RandomnessSentToL2 = 'event RandomSentToL2(uint indexed collectionId)';
  const GiveawayDone = 'event GiveawayExecuted(uint256 indexed collectionId)';

  //const marketplaceID = 579 //TAKE THIS AS A PARAMETER IN DETAILS PAGE!

  //Get Random Seed Test

  const getSeedTest = async () => {
    try {
      const requiredGas = await readContract({
        address: contractAddresses.Main,
        abi: mainContractAbi,
        functionName: 'getRequiredGasForHyperlane'
      })

      const { hash } = await writeContract({
        address: contractAddresses.Main,
        abi: mainContractAbi,
        functionName: 'sendVRFRequest',
        args: [marketplaceID],
        value: requiredGas,
      });

      console.log("hash", hash);
    } catch (e) {
      console.log("error on write", e);
    }

  }

  async function getL1Data(logs, setFunction) {
    const block = await publicClientL1.getBlock({
      blockHash: logs[0].blockHash
    });
    setFunction({
      transactionHash: logs[0].transactionHash,
      timestamp: block.timestamp
    })
  }

  async function getL2Data(logs, setFunction) {
    const block = await publicClientL2.getBlock({
      blockHash: logs[0].blockHash
    });
    setFunction({
      transactionHash: logs[0].transactionHash,
      timestamp: block.timestamp
    })
  }


  useEffect(() => {

    // ********** EVENT TRACKING **********

    const requestToL1 = publicClientL2.watchEvent({
      address: contractAddresses.L2,
      event: parseAbiItem(RandomnessRequestSentToL1),
      args: {
        collectionId: marketplaceID
      },
      onLogs: logs => {
        console.log("Randomness requested from Chainlink: ", logs);
        getL2Data(logs, setVrfRequestL1);
      }
    });

    const randomnessRequested = publicClientL1.watchEvent({
      address: contractAddresses.L1,
      event: parseAbiItem(RandomnessRequestedFromVRF),
      args: {
        collectionId: marketplaceID
      },
      onLogs: logs => {
        console.log("Request To L1 complete.", logs);
        getL1Data(logs, setVrfRequestSentL1);
      }
    });

    const randomnessGenerated = publicClientL1.watchEvent({
      address: contractAddresses.L1,
      event: parseAbiItem(RandomnessGenerated),
      args: {
        collectionId: marketplaceID
      },
      onLogs: logs => {
        console.log("Randomness Generated:", logs);
        getL1Data(logs, setRandomGenerated);
      }
    });

    const randomnessSentL2 = publicClientL1.watchEvent({
      address: contractAddresses.L1,
      event: parseAbiItem(RandomnessSentToL2),
      args: {
        collectionId: marketplaceID
      },
      onLogs: logs => {
        console.log("Randomness Sent To L2:", logs);
        getL1Data(logs, setRandomSentToL2);
      }
    });

    const giveawayFinished = publicClientL2.watchEvent({
      address: contractAddresses.Main,
      event: parseAbiItem(GiveawayDone),
      args: {
        collectionId: marketplaceID
      },
      onLogs: logs => {
        console.log("Giveaway Done", logs);
        getL2Data(logs, setGiveawayDone);
      }
    });

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
        <button onClick={() => getSeedTest()}>Get Random Seed Test Button</button>

        <span className="text-2xl text-black">Sent L2-L1 message with hyperlane {vrfRequestL1 ? "true" + " " + moment.unix(vrfRequestL1.timestamp.toString()).toDate() : "false"}
          {vrfRequestL1 && <a href={L2Explorer + vrfRequestL1.transactionHash}  target="_blank">Go to transaction</a>}
        </span>
        <span className="text-2xl text-black">VRF Requested from Chainlink: {vrfRequestSentL1 ? "true" + " " + moment.unix(vrfRequestSentL1.timestamp.toString()).toDate() : "false"}
        {vrfRequestSentL1 && <a href={L1Explorer + vrfRequestSentL1.transactionHash} target="_blank">Go to transaction</a>}
        </span>
        <span className="text-2xl text-black">Randomness Received From Chainlink: {randomGenerated ? "true" + " " + moment.unix(randomGenerated.timestamp.toString()).toDate() : "false"}
          {randomGenerated && <a href={L1Explorer + randomGenerated.transactionHash} target="_blank">Go to transaction</a>}
        </span>
        <span className="text-2xl text-black">Random Sent L1 to L2: {randomSentToL2 ? "true" + " " + moment.unix(randomSentToL2.timestamp.toString()).toDate() : "false"}
          {randomSentToL2 && <a href={L1Explorer + randomSentToL2.transactionHash} target="_blank">Go to transaction</a>}
        </span>
        <span className="text-2xl text-black">Giveaway Seed Saved: {giveawayDone ? "true" + " " + moment.unix(giveawayDone.timestamp.toString()).toDate() : "false"}
          {giveawayDone && <a href={L2Explorer + giveawayDone.transactionHash} target="_blank">Go to transaction</a>}
        </span>
      </div>
    </div>
  );
}

export default TrackEvents;