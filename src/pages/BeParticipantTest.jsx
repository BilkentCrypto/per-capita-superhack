import { IDKitWidget, solidityEncode } from '@worldcoin/idkit'
import { useAccount } from 'wagmi';
import contractAddresses from '../utils/addresses.json';


export const BeParticipantTest = () => {

    const { address, isConnecting, isDisconnected } = useAccount()

const onSuccess = (data) => {
    
console.log("world data", data);
}

    return(
<div>
<IDKitWidget
    app_id="app_GBkZ1KlVUdFTjeMXKlVUdFT" // must be an app set to on-chain
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