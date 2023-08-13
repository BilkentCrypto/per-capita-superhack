// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
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

//Goerli ISM: 0x56EBcF35f09879C41b7eb9F6FBA4b9fEb1926244
//Ege - VRF Subscription ID: 13173
contract L1Hyperlane is IMessageRecipient, VRFConsumerBaseV2, AutomationCompatibleInterface, ISpecifiesInterchainSecurityModule {
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
    bytes32 keyHash = 0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15; 
    uint32 callbackGasLimit = 350000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;
    VRFCoordinatorV2Interface COORDINATOR;

    address constant VRFCoordinatorAddress = 0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D;

    uint256 public TEST_INT;

    mapping(uint256 => uint256) requestIdToCollectionId;
    uint256[] pendingCollections;
    mapping(uint256 => uint256) collectionIdToSeed;

    address owner;

    Messenger messenger;

     constructor(uint64 _subscriptionId) VRFConsumerBaseV2(VRFCoordinatorAddress) {
        messenger = Messenger(MESSENGER_ADDRESS);
        s_subscriptionId = _subscriptionId;
        COORDINATOR = VRFCoordinatorV2Interface(VRFCoordinatorAddress);
        worldId = IWorldID(WORLD_ID_ADDRESS);
        owner = msg.sender;
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
        uint256 requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
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
