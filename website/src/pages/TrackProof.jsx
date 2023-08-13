//import { watchEvent } from "viem/dist/types/actions/public/watchEvent";
import { useState, useEffect } from "react";
import { parseAbiItem } from "viem";
import contractAddresses from '../utils/addresses.json';
import { publicClientL1, publicClientL2 } from "../utils/viemClients";
import moment from "moment";
import { FaTimes } from 'react-icons/fa'; 

const L1Explorer = "https://goerli.etherscan.io/tx/";
const L2Explorer = "https://testnet.explorer.zora.energy/tx/";

const TrackProof = ({participant}) => {
  const [proofChecked, setProofChecked] = useState();
  const [proofReceived, setProofReceived] = useState();

  //Event Flow: Randomness Request sent to L1 -> Randomness Requested from Chainlink
  // ->Randomness Generated, waiting for Automation -> Randomness Sent to L2 -> Giveaway Executed.

  const proofCheckedEvent = 'event L1GotProof(uint indexed collectionId, address indexed participant, bool proofResult)';
  const proofReceivedEvent = 'event ParticipantAdded(address indexed participant, uint256 indexed collectionId)';


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


    const proofCheckedListener = publicClientL1.watchEvent({
      address: contractAddresses.L1,
      event: parseAbiItem(proofCheckedEvent),
      args: {
        participant: participant
      },
      onLogs: logs => {
        console.log("proofCheckedListener: ", logs);
        getL1Data(logs, setProofChecked);
      }
    });


    const proofReceivedListener = publicClientL2.watchEvent({
      address: contractAddresses.Main,
      event: parseAbiItem(proofReceivedEvent),
      args: {
        participant: participant
      },
      onLogs: logs => {
        console.log("proofReceivedListener: ", logs);
        getL2Data(logs, setProofReceived);
      }
    });

    return () => {
        proofCheckedListener();
        proofReceivedListener();
    }
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-start gap-4 justify-center">
        <span className="text-base text-white">
          Proof verified on World ID L1(Goerli): {proofChecked ? moment.unix(proofChecked.timestamp.toString()).format("hh:mm A") : <span className="text-red-500"><FaTimes className="inline w-6 h-6 text-red-500 mr-1" /></span>}
          {proofChecked && <a href={L1Explorer + proofChecked.transactionHash} target="_blank" className="text-blue-400 ml-2">Go to transaction</a>}
        </span>
        <span className="text-base text-white">
          Proof received and participant added to INO: {proofReceived ?  moment.unix(proofReceived.timestamp.toString()).format("hh:mm A") : <span className="text-red-500"><FaTimes className="inline w-6 h-6 text-red-500 mr-1" /></span>}
          {proofReceived && <a href={L2Explorer + proofReceived.transactionHash} target="_blank" className="text-blue-400 ml-2">Go to transaction</a>}
        </span>
      </div>
    </div>
  );
  
  
}

export default TrackProof;