// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import {IVRFCoordinatorV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import {IInterchainSecurityModule, ISpecifiesInterchainSecurityModule} from "https://github.com/hyperlane-xyz/hyperlane-monorepo/blob/main/solidity/contracts/interfaces/IInterchainSecurityModule.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import { ByteHasher } from './libraries/ByteHasher.sol';
import { IWorldID } from './libraries/IWorldID.sol';

interface IMessageRecipient {
    function handle(
        uint32 _origin, //Domain id of the sender chain
        bytes32 _sender,
        bytes calldata _body
    ) external;
}

interface Messenger {
    function sendMessage(
        address _target,
        bytes memory _message,
        uint32 _gasLimit
    ) external;
}


contract L1Hyperlane is IMessageRecipient, VRFConsumerBaseV2Plus, AutomationCompatibleInterface, ISpecifiesInterchainSecurityModule {
    using ByteHasher for bytes;

    address public L2HyperlaneBroadcaster;
    address public mainContractAddress;
    IInterchainSecurityModule public interchainSecurityModule = IInterchainSecurityModule(0x9eEAdE2A7Fef4F550137fE73F2220586B8341950);

    event RandomNumberRequested(uint indexed collectionId);
    event RandomNumberGenerated(uint indexed collectionId);
    event RandomSentToL2(uint indexed collectionId);
    event L1GotProof(uint indexed collectionId, address indexed participant, bool proofResult);

    //ZORA - L1CrossDomainMessenger
    address constant MESSENGER_ADDRESS = 0xD87342e16352D33170557A7dA1e5fB966a60FafC;

    //HYPERLANE
    address constant MAILBOX = 0xCC737a94FecaeC165AbCf12dED095BB13F037685;

    //WORLD ID
    error InvalidNullifier();
    address WORLD_ID_ADDRESS = 0x11cA3127182f7583EfC416a8771BD4d11Fae4334;
    IWorldID internal immutable worldId;
    uint256 internal immutable groupId = 1;
    string constant APP_ID = "app_staging_2c9d462d4316977be96a258fa730570f";
    string constant ACTION = "bePart_";

    //CHAINLINK
    uint64 s_subscriptionId;
    bytes32 keyHash = 0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae; 
    uint32 callbackGasLimit = 350000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;
    IVRFCoordinatorV2Plus COORDINATOR;

    address constant VRFCoordinatorAddress = 0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B;

    uint256 public TEST_INT;

    mapping(uint256 => uint256) requestIdToCollectionId;
    uint256[] pendingCollections;
    mapping(uint256 => uint256) collectionIdToSeed;


    Messenger messenger;

     constructor(uint64 _subscriptionId) VRFConsumerBaseV2Plus(VRFCoordinatorAddress) {
        messenger = Messenger(MESSENGER_ADDRESS);
        s_subscriptionId = _subscriptionId;
        COORDINATOR = IVRFCoordinatorV2Plus(VRFCoordinatorAddress);
        worldId = IWorldID(WORLD_ID_ADDRESS);
    }

    function bytes32ToAddress(bytes32 _buf) internal pure returns (address) {
        return address(uint160(uint256(_buf)));
    }

    
    // for access control on handle implementations
    modifier onlyMailbox() {
        require(msg.sender == MAILBOX);
        _;    
    }

    
        function verifyWorldIdProof( 
            uint256 marketplaceId,
            address userAddress,
            uint256 root,
            uint256 nullifierHash,
            uint256[8] memory proof
        ) public view returns( bool ) {

            string memory proofAction = string.concat(ACTION, Strings.toString(marketplaceId));
            uint256 externalNullifierHash = abi
            .encodePacked(abi.encodePacked(APP_ID).hashToField(), proofAction)
            .hashToField();

            try worldId.verifyProof(
                    root,
                    groupId,
                    abi.encodePacked( userAddress ).hashToField(),
                    nullifierHash,
                    externalNullifierHash,
                    proof
            ) {
                return true;
            } catch {
                return false;
            }

        }

    function setL2HyperlaneBroadcasterAndMain(address newBroadcastAddress, address newMainAddress) external { //set to once
        address owner = owner();
        require(msg.sender == owner, "not owner");
        owner = address(0);
        L2HyperlaneBroadcaster = newBroadcastAddress;
        mainContractAddress = newMainAddress;
    }

    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _body
    ) external onlyMailbox {
        require( bytes32ToAddress(_sender) == L2HyperlaneBroadcaster, "not L2 broadcaster");
        // require(  ) origin require from 999 can be addet to ensure that only coming from zora goerli network
        bool isVerifyProof;
        uint256 collectionId;
        (isVerifyProof, collectionId) = abi.decode(_body, (bool, uint));
        if(isVerifyProof) {
            address _userAddress;
            uint256 _root;
            uint256 _nullifierHash;
            uint256[8] memory _proof;
            (isVerifyProof, collectionId, _userAddress, _root, _nullifierHash, _proof) = abi.decode(_body, (bool, uint, address, uint, uint, uint[8]));
            bool proofResult = verifyWorldIdProof(collectionId, _userAddress, _root, _nullifierHash, _proof);
            messenger.sendMessage(
                mainContractAddress,
                abi.encodeWithSignature(
                "gotProof(bytes)",
                abi.encode(collectionId, _userAddress, proofResult, _nullifierHash)
            ),
            700000 // use whatever gas limit you want
            ); 
            emit L1GotProof(collectionId, _userAddress, proofResult);
        } else {
            requestRandomWords(collectionId);
        }

        
    }

    function requestRandomWords(uint collectionId) internal {
        uint256 requestId = s_vrfCoordinator.requestRandomWords(VRFV2PlusClient.RandomWordsRequest({
            keyHash: keyHash,
            subId: s_subscriptionId,
            requestConfirmations: requestConfirmations,
            callbackGasLimit: callbackGasLimit,
            numWords: numWords,
            extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: false}))
          })
        );

        requestIdToCollectionId[requestId] = collectionId;
        emit RandomNumberRequested(collectionId);
    }

 
    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        uint randomNumber = _randomWords[0];
        uint collectionId = requestIdToCollectionId[_requestId];

        pendingCollections.push(collectionId);
        collectionIdToSeed[collectionId] = randomNumber;
        emit RandomNumberGenerated(collectionId);
    }


    function checkUpkeep(bytes calldata /* checkData */) external view override returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = pendingCollections.length > 0;
        performData = "";
        
    }

    function performUpkeep(bytes calldata /* performData */) external override {
        storeToL2();  
    }


    //Stores the random number in main contract in Optimism Goerli
     function storeToL2() public { // şimdilik verimsiz yapıyorum belki hepsini tekte yollayabiliriz

        require(pendingCollections.length > 0, "no pending seed");

    //it can be done with while again but gas is increasing fast, hesaplamamız lazım, it should be calculated
        uint256 collectionId = pendingCollections[pendingCollections.length - 1];
        pendingCollections.pop();
        uint256 seed = collectionIdToSeed[collectionId];

        messenger.sendMessage(
        mainContractAddress,
        abi.encodeWithSignature(
            "submitRandomSeed(bytes)",
            abi.encode(collectionId, seed)
        ),
        500000 // use whatever gas limit you want
        ); 

        emit RandomSentToL2(collectionId);
    
    }


    //mock code for fast trying
    //Stores the random number in main contract in Optimism Goerli
    function storeToL2Mock(address _testL2Addr, uint256 collectionId, uint256 seed ) public { // şimdilik verimsiz yapıyorum belki hepsini tekte yollayabiliriz
            messenger.sendMessage(
            _testL2Addr,
            abi.encodeWithSignature(
                "submitMock(bytes)",
                abi.encode(collectionId, seed)
            ),
            500000 // use whatever gas limit you want
            ); 

            
    }

}
