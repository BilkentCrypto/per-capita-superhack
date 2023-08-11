// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import { ByteHasher } from './libraries/ByteHasher.sol';
import { IWorldID } from './libraries/IWorldID.sol';

contract PerCapita is IERC721Receiver {
    using ByteHasher for bytes;

    address public L2_VRF_BROADCAST_ADDRESS;
    L2VRFHyperlaneBroadcaster hyperlaneBroadcaster;

    address public L1_VRF_RECEIVER_ADDRESS; 


    //HYPERLANE 
    IInterchainGasPaymaster igp = IInterchainGasPaymaster(
        0xb32687e14558C96d5a4C907003327A932356B42b
    );
    uint256 hyperlaneGas = 600000;
    uint32 constant goerliDomain = 5;

    event CollectionCreated(string indexed name, uint256 indexed collectionId);
    event ParticipantAdded(address indexed participant, uint256 indexed collectionId);
    event GiveawayExecuting(uint256 indexed collectionId);
    event GiveawayExecuted(uint256 indexed collectionId);
    event NFTClaimed(uint256 indexed collectionId, address claimer);
    event PriceClaimed(uint256 indexed collectionId);


    //OPTIMISM
    address constant ovmL2CrossDomainMessengerAddress = 0x4200000000000000000000000000000000000007;
    L2CrossDomainMessenger ovmL2CrossDomainMessenger;

    Marketplace[] public marketplaces;
    

    //WORLD_ID
    error InvalidNullifier();
    address WORLD_ID_ADDRESS = 0x11cA3127182f7583EfC416a8771BD4d11Fae4334;
    IWorldID internal immutable worldId;
    uint256 internal immutable groupId = 1;
    mapping(uint256 => bool) public nullifierHashes;

    enum MarketplaceType {
        NULL,
        NFT_GIVEAWAY
    }

    uint constant RANDOM_PRIME = 325778765244908313467197;
    uint constant MOD_OF_RANDOM = 100000000000000000000;
    uint constant EXECUTOR_REWARD_MAX_LIMIT = 10; //divisor
    uint constant EXECUTOR_REWARD_INCREASE_FACTOR = 1000; //divisor
    




    mapping( uint => uint[] ) public NFTsOfMarketplaces;
    mapping( address => uint ) public balance;

    mapping(uint => mapping(address => Participant)) public participants;

    struct Participant {
        bool isParticipated;
        uint nonce;
        bool isClaimed;
    }

    struct Marketplace {
        MarketplaceType marketType;
        string imageUri;
        string name;
        string description;
        uint256 giveawayTime;
        address owner;
        address contractAddress;
        uint256 price;
        uint pool;
        address transferPricesTo;
        bool isDistributed;
        uint randomSeed;
        uint participantNumber;
    }

    constructor( address _L1_VRF_RECEIVER_ADDRESS, address _L2_VRF_BROADCAST_ADDRESS) {
        L2_VRF_BROADCAST_ADDRESS = _L2_VRF_BROADCAST_ADDRESS;
        L1_VRF_RECEIVER_ADDRESS = _L1_VRF_RECEIVER_ADDRESS;
        marketplaces.push();
        //semaphore = ISemaphore(SEMAPHORE_ADDRESS);
        hyperlaneBroadcaster = L2VRFHyperlaneBroadcaster(L2_VRF_BROADCAST_ADDRESS);
        worldId = IWorldID(WORLD_ID_ADDRESS);
        ovmL2CrossDomainMessenger = L2CrossDomainMessenger(ovmL2CrossDomainMessengerAddress);
    }



    function createGiveawayMarketplace ( 
        string calldata _imageUri, 
        string calldata _name,
        string calldata _description,
        uint256 _giveawayTime, 
        address _contractAddress, 
        uint256 _price, 
        address _transferPricesTo 
        ) external {

        address msgSender = msg.sender;

        marketplaces.push( Marketplace(
                {
                marketType: MarketplaceType.NFT_GIVEAWAY,
                imageUri: _imageUri,
                name: _name,
                description: _description,
                giveawayTime: _giveawayTime,
                owner: msgSender,
                contractAddress: _contractAddress,
                price: _price,
                pool: 0,
                transferPricesTo: _transferPricesTo,
                isDistributed: false,
                randomSeed: 0,
                participantNumber: 0
                }
            ) );

        uint marketplaceID = marketplaces.length; 
        //ID sıfır olmasın, L1'deki kontratta mappingte tutuyoruz, sıkıntı çıkmasın.
        //Websitede ID meselesini ayarlarız.
        emit CollectionCreated(_name, marketplaceID - 1);
    } 

/*
actionId: abi.encode( contractAddress, marketplaceId )
signal: abi.encode(receiver) (current metamask wallet address)
*/
        function beParticipant( 
            uint marketplaceId,
            uint256 root,
            uint256 nullifierHash,
            uint256[8] calldata proof
            ) external payable {

        require( nullifierHashes[ nullifierHash ] == false, "reused nullifier");
        //if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        Marketplace memory marketplace = marketplaces[ marketplaceId ];
        require( marketplace.marketType == MarketplaceType.NFT_GIVEAWAY, "not giveaway" );
        require( block.timestamp < marketplace.giveawayTime, "participation ended" );

        address msgSender = msg.sender;
        Participant memory participant = participants[ marketplaceId ][ msgSender ];
        
        require( participant.isParticipated == false, "already participated with this address" );

        uint msgValue = msg.value;
        require( msgValue >= marketplace.price, "not enough ethers" );



        worldId.verifyProof(
            root,
            groupId,
            abi.encodePacked( msgSender ).hashToField(),
            nullifierHash,
            abi.encodePacked( address(this), marketplaceId ).hashToField(),
            proof
        );
        nullifierHashes[ nullifierHash ] = true;


        marketplaces[ marketplaceId ].pool += msgValue;
        participants[ marketplaceId ][ msgSender ].isParticipated = true;
        participants[ marketplaceId ][ msgSender ].nonce = marketplace.participantNumber;
        ++marketplaces[ marketplaceId ].participantNumber;

        emit ParticipantAdded(msg.sender, marketplaceId);
    }


    //For Test
            function beParticipantMock( 
            uint marketplaceId
            ) external payable {


        Marketplace memory marketplace = marketplaces[ marketplaceId ];
        require( marketplace.marketType == MarketplaceType.NFT_GIVEAWAY, "not giveaway" );
        require( block.timestamp < marketplace.giveawayTime, "participation ended" );

        address msgSender = msg.sender;
        Participant memory participant = participants[ marketplaceId ][ msgSender ];
        
        require( participant.isParticipated == false, "already participated with this address" );

        uint msgValue = msg.value;
        require( msgValue >= marketplace.price, "not enough ethers" );



        marketplaces[ marketplaceId ].pool += msgValue;
        participants[ marketplaceId ][ msgSender ].isParticipated = true;
        participants[ marketplaceId ][ msgSender ].nonce = marketplace.participantNumber;
        ++marketplaces[ marketplaceId ].participantNumber;

        emit ParticipantAdded(msg.sender, marketplaceId);
    }


        function verifyTest( 
            uint256 marketplaceId,
            uint256 root,
            uint256 nullifierHash,
            uint256[8] calldata proof
        ) external view returns( bool ) {

/*
        uint256 externalNullifierHash = abi
        .encodePacked(abi.encodePacked(_appId).hashToField(), _action)
        .hashToField();
*/
        worldId.verifyProof(
            root,
            groupId,
            abi.encodePacked( msg.sender ).hashToField(),
            nullifierHash,
            abi.encodePacked( address(this), marketplaceId ).hashToField(),
            proof
        );
  
            return true;
        }


    //used chainlink for test only
    /*
    function getRandomNumber() internal view returns( uint ) {
        uint randomNumber;

        randomNumber = uint(keccak256(abi.encodePacked( block.number / 2, block.timestamp)));

        return randomNumber;
    }
    */


    function getExecutorReward( uint marketplaceId ) public view returns( uint ) {
        Marketplace memory marketplace = marketplaces[ marketplaceId ];
        uint lockedPool;
        if( marketplace.participantNumber >= NFTsOfMarketplaces[ marketplaceId ].length ) {
            lockedPool = marketplace.pool - ( (marketplace.participantNumber - NFTsOfMarketplaces[ marketplaceId ].length ) * marketplace.price );
        } else {
            lockedPool = marketplace.pool;
        }
        
        uint reward = lockedPool / EXECUTOR_REWARD_INCREASE_FACTOR * (block.timestamp - marketplace.giveawayTime);
        if( reward > lockedPool / EXECUTOR_REWARD_MAX_LIMIT ) {
            reward = lockedPool / EXECUTOR_REWARD_MAX_LIMIT;
        }

        return reward;
    }


    function getRequiredGasForHyperlane() public view returns(uint256) {
        return igp.quoteGasPayment(
            goerliDomain,
            hyperlaneGas
        );
    } 

    function executeGiveaway( uint marketplaceId ) external payable {
        Marketplace memory marketplace = marketplaces[ marketplaceId ];
        require( marketplace.marketType == MarketplaceType.NFT_GIVEAWAY, "not giveaway" );
        require( block.timestamp > marketplace.giveawayTime, "participation not ended" );
        require( marketplace.isDistributed == false, "already distributed" );
        require( msg.value >= getRequiredGasForHyperlane(), "not enough gas for hyperlane" );

        marketplaces[ marketplaceId ].isDistributed = true;
        //marketplaces[ marketplaceId ].randomSeed = getRandomNumber();


        uint lockedPool;
        if( marketplace.participantNumber >= NFTsOfMarketplaces[ marketplaceId ].length ) {
            lockedPool = marketplace.pool - ( (marketplace.participantNumber - NFTsOfMarketplaces[ marketplaceId ].length ) * marketplace.price );
        } else {
            lockedPool = marketplace.pool;
        }

        uint reward = getExecutorReward( marketplaceId );
        payable( msg.sender ).transfer( reward );
        balance[ marketplace.transferPricesTo ] += lockedPool - reward;

        hyperlaneBroadcaster.getRandomSeed{value: msg.value}(marketplaceId);
        
        emit GiveawayExecuting(marketplaceId);
    }

    function sendVRFRequest(uint marketplaceID) external payable { //DELETE FOR PRODUCTION
    require( msg.value >= getRequiredGasForHyperlane(), "not enough gas for hyperlane" );
        hyperlaneBroadcaster.getRandomSeed{value: msg.value}(marketplaceID);
    }

    modifier onlyL1Receiver {
        require(msg.sender == address(ovmL2CrossDomainMessenger));
        require(ovmL2CrossDomainMessenger.xDomainMessageSender() == L1_VRF_RECEIVER_ADDRESS);
        _;
    }

    function submitRandomSeed(
        bytes calldata parameters
    ) external onlyL1Receiver {
        uint256 collectionId;
        uint256 seed;
        (collectionId, seed) = abi.decode(parameters, (uint256, uint256));
        marketplaces[ collectionId ].randomSeed = seed % MOD_OF_RANDOM;

        emit GiveawayExecuted(collectionId);
    }

    //************USED FOR TESTING AUTOMATION AND VRF************
    uint public  mockSeed;
    uint public mockCollectionId;
    function submitMock(bytes calldata parameters) external onlyL1Receiver {
        (mockCollectionId, mockSeed) = abi.decode(parameters, (uint256, uint256));
    } 

    function getGiveawayResult( uint marketplaceId, address participant ) public view returns( uint ) {
        require( participants[ marketplaceId ][ participant ].isParticipated, "not participated" );
        Marketplace memory marketplace = marketplaces[ marketplaceId ];
        require( marketplace.isDistributed, "not distributed yet" );
        require( marketplaces[ marketplaceId ].randomSeed > 0, "have not gotten random yet");
        return ( participants[ marketplaceId ][ participant ].nonce * RANDOM_PRIME + marketplace.randomSeed ) % marketplace.participantNumber;
    }

    function claimNFT( uint marketplaceId ) external {

        address msgSender = msg.sender;
        Marketplace memory marketplace = marketplaces[ marketplaceId ];
        require( marketplace.marketType == MarketplaceType.NFT_GIVEAWAY, "not giveaway" );
        require( marketplace.isDistributed, "not distributed" );
        require( marketplaces[ marketplaceId ].randomSeed > 0, "have not gotten random yet");
        require( participants[ marketplaceId ][ msgSender ].isClaimed == false, "already claimed" );

        //winners have values below winnerNumber
        uint[] memory nfts = NFTsOfMarketplaces[ marketplaceId ];
        uint result = getGiveawayResult( marketplaceId, msgSender );
        require( nfts.length > result, "not winner" );

        participants[ marketplaceId ][ msgSender ].isClaimed = true;
        IERC721( marketplace.contractAddress ).transferFrom( 
            address( this ),
            msgSender,
            result
        );

        emit NFTClaimed(marketplaceId, msg.sender);
    }


        function claimPrice( uint marketplaceId ) external {
        address msgSender = msg.sender;
        Marketplace memory marketplace = marketplaces[ marketplaceId ];
        require( marketplace.marketType == MarketplaceType.NFT_GIVEAWAY, "not giveaway" );
        require( marketplace.isDistributed, "not distributed" );
        require( marketplaces[ marketplaceId ].randomSeed > 0, "have not gotten random yet");
        require( participants[ marketplaceId ][ msgSender ].isClaimed == false, "already claimed" );

        //winners have values below winnerNumber
        uint[] memory nfts = NFTsOfMarketplaces[ marketplaceId ];
        uint result = getGiveawayResult( marketplaceId, msgSender );
        require( nfts.length <= result, "winner cannot take prices" );

        participants[ marketplaceId ][ msgSender ].isClaimed = true;
        payable( msgSender ).transfer( marketplace.price );

        emit PriceClaimed(marketplaceId);
    }


    function bytesToUint(bytes memory b) internal pure returns (uint256) {
        uint256 number;
        for(uint i=0;i<b.length;i++){
            number = number + uint(uint8(b[i]))*(2**(8*(b.length-(i+1))));
        }
    return number;
    }

    function withdraw() external {
        address msgSender = msg.sender;
        uint amount = balance[ msgSender ];
        require( amount > 0 , "no balance of user");
        balance[ msgSender ] = 0;
        payable( msgSender ).transfer( amount );
    }


    //marketplace id can be passed as data
    //requirelar işe yaramıyor yani bazıları
    function onERC721Received( address operator, address from, uint256 tokenId, bytes memory data ) public override returns (bytes4) {

        uint marketplaceId = bytesToUint( data );
        require( marketplaceId != 0, "no data" );
        require( marketplaceId < marketplaces.length, "invalid id" );

        Marketplace memory marketplace = marketplaces[ marketplaceId ];
        
        require( marketplace.contractAddress == msg.sender, "not equal to marketplace's nft contract" );
        require( marketplace.owner == operator || marketplace.owner == from || address(0) == from, "not owner" );
        require( block.timestamp < marketplace.giveawayTime, "participation ended" );

        NFTsOfMarketplaces[ marketplaceId ].push( tokenId );


        return this.onERC721Received.selector;
    }

    function renounceOwnership( uint marketplaceId ) external {
        require( marketplaceId < marketplaces.length && marketplaceId > 0, "invalid id" );
        Marketplace memory marketplace = marketplaces[ marketplaceId ];
        require( marketplace.owner == msg.sender, "not owner" );

        marketplaces[ marketplaceId ].owner = address(0);
    }

    function getBlockTimestamp() public view returns( uint ) {
        return block.timestamp;
    }



//first approve from the erc721 contract in the frontend 
    function addAllNFTstoMarketplace( uint256 marketplaceId, uint256[] calldata ids ) external {
        require( marketplaceId < marketplaces.length && marketplaceId > 0, "invalid id" );
        address msgSender = msg.sender; 

        Marketplace memory marketplace = marketplaces[ marketplaceId ];

        require( marketplace.owner == msgSender, "not owner" );
        require( block.timestamp < marketplace.giveawayTime, "participation ended" );

        address contractAddress = marketplace.contractAddress;

        for( uint i = 0; i < ids.length; i++ ) {
            uint256 current = ids[i];
            IERC721( contractAddress ).transferFrom( 
                msgSender,
                address( this ),
                current
            );

            NFTsOfMarketplaces[ marketplaceId ].push( current );

        }
        

    }

    function fetchAllMarketplaces() external view returns( Marketplace[] memory ) {
        return marketplaces;
    }

    function fetchMarketplace( uint id ) external view returns( Marketplace memory ) {
        return marketplaces[ id ];
    }

    function fetchNFTsOfMarketplace( uint id ) external view returns( uint[] memory ) {
        return NFTsOfMarketplaces[ id ];
    }


}

interface L2VRFHyperlaneBroadcaster {
    function getRandomSeed(uint collectionId) external payable;
}

interface L2CrossDomainMessenger {
    function xDomainMessageSender() external returns (address);
}

interface IInterchainGasPaymaster {


    /**
     * @notice Deposits msg.value as a payment for the relaying of a message
     * to its destination chain.
     * @dev Overpayment will result in a refund of native tokens to the _refundAddress.
     * Callers should be aware that this may present reentrancy issues.
     * @param _messageId The ID of the message to pay for.
     * @param _destinationDomain The domain of the message's destination chain.
     * @param _gasAmount The amount of destination gas to pay for.
     * @param _refundAddress The address to refund any overpayment to.
     */
    function payForGas(
        bytes32 _messageId,
        uint32 _destinationDomain,
        uint256 _gasAmount,
        address _refundAddress
    ) external payable;

    /**
     * @notice Quotes the amount of native tokens to pay for interchain gas.
     * @param _destinationDomain The domain of the message's destination chain.
     * @param _gasAmount The amount of destination gas to pay for.
     * @return The amount of native tokens required to pay for interchain gas.
     */
    function quoteGasPayment(uint32 _destinationDomain, uint256 _gasAmount)
        external
        view
        returns (uint256);
}