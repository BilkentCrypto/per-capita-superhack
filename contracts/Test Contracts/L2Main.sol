// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;



contract L2Main {
    //OPTIMISM
    address constant ovmL2CrossDomainMessengerAddress = 0x4200000000000000000000000000000000000007;
    L2CrossDomainMessenger ovmL2CrossDomainMessenger;

    constructor() {
        ovmL2CrossDomainMessenger = L2CrossDomainMessenger(0x4200000000000000000000000000000000000007);
    }



    //************USED FOR TESTING AUTOMATION AND VRF************
    uint public  mockSeed;
    uint public mockCollectionId;
    address public msgSender;
    address public xDomainSender;


        function submitMock(bytes calldata parameters) external {
        (mockCollectionId, mockSeed) = abi.decode(parameters, (uint256, uint256));
        msgSender = msg.sender;
        xDomainSender = ovmL2CrossDomainMessenger.xDomainMessageSender();
    } 



}

    interface L2CrossDomainMessenger {
    function xDomainMessageSender() external returns (address);
}