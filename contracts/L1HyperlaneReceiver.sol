// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";


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

//Ege - VRF Subscription ID: 13173
contract L1Hyperlane is IMessageRecipient, VRFConsumerBaseV2, AutomationCompatibleInterface {

    address public L2HyperlaneBroadcaster;
    address public mainContractAddress;

    event RandomNumberRequested(uint indexed collectionId);
    event RandomNumberGenerated(uint indexed collectionId);
    event RandomSentToL2(uint indexed collectionId);

    //OPTIMISM
    address constant MESSENGER_ADDRESS = 0x5086d1eEF304eb5284A0f6720f79403b4e9bE294;

    //HYPERLANE
    address constant MAILBOX = 0xCC737a94FecaeC165AbCf12dED095BB13F037685;

    //CHAINLINK
    uint64 s_subscriptionId;
    bytes32 keyHash = 0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15; 
    uint32 callbackGasLimit = 350000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;
    VRFCoordinatorV2Interface COORDINATOR;

    address constant VRFCoordinatorAddress = 0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D;


    mapping(uint256 => uint256) requestIdToCollectionId;
    uint256[] pendingCollections;
    mapping(uint256 => uint256) collectionIdToSeed;

    address owner;

    Messenger messenger;

     constructor(uint64 _subscriptionId) VRFConsumerBaseV2(VRFCoordinatorAddress) {
        messenger = Messenger(MESSENGER_ADDRESS);
        s_subscriptionId = _subscriptionId;
        COORDINATOR = VRFCoordinatorV2Interface(VRFCoordinatorAddress);
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
        // require(  ) origin require'ı eklenebilir sadece optimism goerli'den geldiğine emin olmak için
        uint collectionId = abi.decode(_body, (uint));
        requestRandomWords(collectionId);
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
        400000 // use whatever gas limit you want
        ); 

        emit RandomSentToL2(collectionId);
    
    }


//mock code for fast trying
        //Stores the random number in main contract in Optimism Goerli
     function storeToL2Mock(uint256 collectionId, uint256 seed ) public { // şimdilik verimsiz yapıyorum belki hepsini tekte yollayabiliriz
            messenger.sendMessage(
            mainContractAddress,
            abi.encodeWithSignature(
                "submitMock(bytes)",
                abi.encode(collectionId, seed)
            ),
            400000 // use whatever gas limit you want
            ); 

            
    }

}
