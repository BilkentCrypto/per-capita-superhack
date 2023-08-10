// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
//import { ByteHasher } from './libraries/ByteHasher.sol';
//import { ISemaphore } from './libraries/ISemaphore.sol';

contract PerCapita is IERC721Receiver {
    //using ByteHasher for bytes;

    address public L2_VRF_BROADCAST_ADDRESS;
    L2VRFHyperlaneBroadcaster hyperlaneBroadcaster;

    address public L1_VRF_RECEIVER_ADDRESS; 


    event CollectionCreated(string indexed uri, uint256 indexed collectionId);
    event ParticipantAdded(address indexed participant, uint256 indexed collectionId);
    event GiveawayExecuting(uint256 indexed collectionId);
    event GiveawayExecuted(uint256 indexed collectionId);
    event NFTClaimed(uint256 indexed collectionId, address claimer);
    event PriceClaimed(uint256 indexed collectionId);


    //OPTIMISM
    address constant ovmL2CrossDomainMessengerAddress = 0x4200000000000000000000000000000000000007;
    L2CrossDomainMessenger ovmL2CrossDomainMessenger;

    Marketplace[] public marketplaces;
    

    //ISemaphore internal immutable semaphore;
    //mapping(uint256 => bool) internal nullifierHashes;

    enum MarketplaceType {
        NULL,
        NFT_GIVEAWAY
    }

    uint constant RANDOM_PRIME = 325778765244908313467197;
    uint constant MOD_OF_RANDOM = 100000000000000000000;
    uint constant EXECUTOR_REWARD_MAX_LIMIT = 10; //divisor
    uint constant EXECUTOR_REWARD_INCREASE_FACTOR = 1000; //divisor
    
    //address constant SEMAPHORE_ADDRESS = 0x330C8452C879506f313D1565702560435b0fee4C;
    //uint constant SEMAPHORE_GROUP_ID = 1;



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
        string marketplaceURI;
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
        marketplaces.push();
        //semaphore = ISemaphore(SEMAPHORE_ADDRESS);
        hyperlaneBroadcaster = L2VRFHyperlaneBroadcaster(L2_VRF_BROADCAST_ADDRESS);
        ovmL2CrossDomainMessenger = L2CrossDomainMessenger(ovmL2CrossDomainMessengerAddress);
        L2_VRF_BROADCAST_ADDRESS = _L2_VRF_BROADCAST_ADDRESS;
        L1_VRF_RECEIVER_ADDRESS = _L1_VRF_RECEIVER_ADDRESS;
    }



    function createGiveawayMarketplace ( 
        string calldata _marketplaceURI, 
        uint256 _giveawayTime, 
        address _contractAddress, 
        uint256 _price, 
        address _transferPricesTo 
        ) external {

        address msgSender = msg.sender;

        marketplaces.push( Marketplace(
                {
                marketType: MarketplaceType.NFT_GIVEAWAY,
                marketplaceURI: _marketplaceURI,
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
        emit CollectionCreated(_marketplaceURI, marketplaceID);
    } 

/*
actionId: abi.encode( contractAddress, marketplaceId )
signal: abi.encode(receiver) (current metamask wallet address)
*/
        function beParticipant( 
            uint marketplaceId
            //uint256 root,
            //uint256 nullifierHash,
            //uint256[8] calldata proof
            ) external payable {

        //require( nullifierHashes[ nullifierHash ], "reused nullifier");

        Marketplace memory marketplace = marketplaces[ marketplaceId ];
        require( marketplace.marketType == MarketplaceType.NFT_GIVEAWAY, "not giveaway" );
        require( block.timestamp < marketplace.giveawayTime, "participation ended" );

        address msgSender = msg.sender;
        Participant memory participant = participants[ marketplaceId ][ msgSender ];
        
        require( participant.isParticipated == false, "already participated with this address" );

        uint msgValue = msg.value;
        require( msgValue >= marketplace.price, "not enough ethers" );

/*
        semaphore.verifyProof(
            root,
            SEMAPHORE_GROUP_ID,
            abi.encodePacked( msgSender ).hashToField(),
            nullifierHash,
            abi.encodePacked( address(this), marketplaceId ).hashToField(),
            proof
        );
*/

        marketplaces[ marketplaceId ].pool += msgValue;
        //nullifierHashes[ nullifierHash ] = true;
        participants[ marketplaceId ][ msgSender ].isParticipated = true;
        participants[ marketplaceId ][ msgSender ].nonce = marketplace.participantNumber;
        ++marketplaces[ marketplaceId ].participantNumber;

        emit ParticipantAdded(msg.sender, marketplaceId);
    }

/*
        function verifyTest( 
            uint256 marketplaceId,
            uint256 root,
            uint256 nullifierHash,
            uint256[8] calldata proof
        ) external view returns( bool ) {

        semaphore.verifyProof(
            root,
            SEMAPHORE_GROUP_ID,
            abi.encodePacked( 0x2d6ADf049756DE7430f5cF040674E9901CC805Cf ).hashToField(),
            nullifierHash,
            abi.encodePacked( 0xa4f7245336B78B4DB9E726c0aE2b4B39b856A111 ,marketplaceId ).hashToField(),
            proof
        );
  
            return true;
        }

        /*

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


    function executeGiveaway( uint marketplaceId ) external {
        Marketplace memory marketplace = marketplaces[ marketplaceId ];
        require( marketplace.marketType == MarketplaceType.NFT_GIVEAWAY, "not giveaway" );
        require( block.timestamp > marketplace.giveawayTime, "participation not ended" );
        require( marketplace.isDistributed == false, "already distributed" );

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

        hyperlaneBroadcaster.getRandomSeed(marketplaceId);
        
        emit GiveawayExecuting(marketplaceId);
    }

    function sendVRFRequest(uint marketplaceID) public {
        hyperlaneBroadcaster.getRandomSeed(marketplaceID);
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
    function addAllNFTstoMarketplace( uint256 marketplaceId ) external {
        require( marketplaceId < marketplaces.length && marketplaceId > 0, "invalid id" );
        address msgSender = msg.sender; 

        Marketplace memory marketplace = marketplaces[ marketplaceId ];

        require( marketplace.owner == msgSender, "not owner" );
        require( block.timestamp < marketplace.giveawayTime, "participation ended" );

        address contractAddress = marketplace.contractAddress;

        uint totalSupply = IERC721Enumerable( contractAddress ).totalSupply();

        for( uint index = 0; index < totalSupply; index++ ) {

        IERC721( contractAddress ).transferFrom( 
            msgSender,
            address( this ),
            index
         );

        NFTsOfMarketplaces[ marketplaceId ].push( index );

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
    function getRandomSeed(uint collectionId) external;
}

interface L2CrossDomainMessenger {
    function xDomainMessageSender() external returns (address);
}

