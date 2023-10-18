// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import { SemaphoreVerifier } from '@semaphore-protocol/contracts/base/SemaphoreVerifier.sol';
import { ISemaphore } from '@semaphore-protocol/contracts/interfaces/ISemaphore.sol';
import { Semaphore } from '@semaphore-protocol/contracts/Semaphore.sol';

// supports ERC20 or ERC721
interface Balanceable {
    function balanceOf(address _owner) external view returns (uint256);
}

contract MessageBoard {

    uint256 public constant DEPOSIT = 0.01 ether;

    ISemaphore public semaphore;
    
    // token address => user address => identityCommitment
    mapping(address => mapping(address => uint256)) public identities;
    mapping(address => bool) public groups;

    event MessagePosted(address tokenAddress, address poster, string message);

    error InvalidDeposit();
    error AlreadyAMember();
    error NotAHolder();
    error NotAMember();
    error CantLeave();

    constructor() {
        //semaphore = new Semaphore(new SemaphoreVerifier());
        semaphore = Semaphore(0x3889927F0B5Eb1a02C6E2C20b39a1Bd4EAd76131);
    }

    function joinGroup(
        address tokenAddress,
        uint256 identityCommitment
    ) external payable {
        if (msg.value != DEPOSIT) revert InvalidDeposit();
        if (Balanceable(tokenAddress).balanceOf(msg.sender) == 0) revert NotAHolder();
        if (identities[tokenAddress][msg.sender] != 0) revert AlreadyAMember();

        uint256 groupId = getGroupId(tokenAddress);

        if (!groups[tokenAddress]) {
            semaphore.createGroup(groupId, 20, address(this)); // TODO how to calculate max depth
            groups[tokenAddress] = true;
        }

        semaphore.addMember(groupId, identityCommitment);
        identities[tokenAddress][msg.sender] = identityCommitment;
    }

    function leaveGroup(
        address tokenAddress, 
        address memberAddress, 
        uint256[] calldata proofSiblings, 
        uint8[] calldata proofPathIndices
    ) external {
        if (identities[tokenAddress][memberAddress] == 0) revert NotAMember();

        if (Balanceable(tokenAddress).balanceOf(memberAddress) == 0 || memberAddress == msg.sender) {
            semaphore.removeMember(getGroupId(tokenAddress), identities[tokenAddress][memberAddress], proofSiblings, proofPathIndices);
            identities[tokenAddress][msg.sender] = 0;
            payable(msg.sender).transfer(DEPOSIT);
        } else {
            revert CantLeave();
        }
    }

    function postMessage(
        address tokenAddress,
        string memory message,
        uint256 merkleTreeRoot,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        uint256 messageInt = uint256(keccak256(abi.encodePacked(message)));
        semaphore.verifyProof(getGroupId(tokenAddress), merkleTreeRoot, messageInt, nullifierHash, getGroupId(tokenAddress), proof);
        emit MessagePosted(tokenAddress, msg.sender, message);
    }

    function getGroupId(address tokenAddress) public pure returns (uint256) {
        return uint256(uint160(tokenAddress));
    }
}