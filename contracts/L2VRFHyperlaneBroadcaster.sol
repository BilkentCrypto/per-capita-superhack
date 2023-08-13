// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.15;


//L2 Hyperlane - 0x01CEb6fD0ad99000A7Fd95EC65AE5947Db3d7784
contract L2VRFHyperlaneBroadcaster {

    address public mainContractAddress;
    address public hyperlaneReceiver;

    event RandomnessRequestSentToL1(uint256 indexed collectionId);

    uint number;
    uint256 gasAmount = 300000;

    uint32 constant goerliDomain = 5;
    //address constant goerliReceiver = 0x36FdA966CfffF8a9Cdc814f546db0e6378bFef35;
    address constant zoraMailbox = 0x51930e22E1D6d20E617BcF29693E187C015eBC6a;
    IInterchainGasPaymaster igp = IInterchainGasPaymaster(
        0xb32687e14558C96d5a4C907003327A932356B42b
    );

    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    address owner;
   

    constructor(address _hyperlaneReceiver) {
        owner = msg.sender;
        hyperlaneReceiver = _hyperlaneReceiver;
    }

    modifier onlyMainContract() {
        require(msg.sender == mainContractAddress);
        _;    
    }

    function getRandomSeed(uint collectionId) external payable {

        bytes32 messageId = IMailbox(zoraMailbox).dispatch(
            goerliDomain,
            addressToBytes32(hyperlaneReceiver),
            abi.encode(false, collectionId)
        );


        // Pay from the contract's balance
        igp.payForGas{ value: msg.value }(
            messageId, // The ID of the message that was just dispatched
            goerliDomain, // The destination domain of the message
            1200000,
            address(tx.origin) // refunds are returned to transaction executer
        );

        emit RandomnessRequestSentToL1(collectionId);
    }

        function getProof(            
            uint256 collectionId,
            address userAddress,
            uint256 root,
            uint256 nullifierHash,
            uint256[8] memory proof
            ) external payable {

        bytes32 messageId = IMailbox(zoraMailbox).dispatch(
            goerliDomain,
            addressToBytes32(hyperlaneReceiver),
            abi.encode(true, collectionId, userAddress, root, nullifierHash, proof)
        );


        // Pay from the contract's balance
        igp.payForGas{ value: msg.value }(
            messageId, // The ID of the message that was just dispatched
            goerliDomain, // The destination domain of the message
            gasAmount,
            address(tx.origin) // refunds are returned to transaction executer
        );

        emit RandomnessRequestSentToL1(collectionId);
    }

    function setMainContractAddressOnce(address newMainAddress) external { //set to once
        require(msg.sender == owner, "not owner");
        owner = address(0);
        mainContractAddress = newMainAddress;
    }

    receive() external payable {}

    function deposit() external payable {}

    function withdraw() external {
        payable(owner).transfer(address(this).balance);
    }


}

interface IMailbox {
        function dispatch(
        uint32 _destination,
        bytes32 _recipient,
        bytes calldata _body
    ) external returns (bytes32);
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