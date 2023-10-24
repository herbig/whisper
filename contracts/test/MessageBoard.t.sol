// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import {Test, console2} from "forge-std/Test.sol";
import { MessageBoard } from "../src/MessageBoard.sol";
import { Semaphore } from '@semaphore-protocol/contracts/Semaphore.sol';
import { SemaphoreVerifier } from '@semaphore-protocol/contracts/base/SemaphoreVerifier.sol';

contract TestToken {
    uint balance;
    constructor(uint _balance) {
        balance = _balance;
    }
    function balanceOf(address) external view returns (uint256) {
        return balance;
    }
}

contract CounterTest is Test {
    
    TestToken public holder = new TestToken(1);
    TestToken public nonholder = new TestToken(0);

    MessageBoard public board;

    function setUp() public {
        board = new MessageBoard();
    }

    function test_Join() public {
        // board.joinGroup{value: 0.01 ether}(address(holder), 10669065099493193936705055788933239467811633929046887950091188469879350368937);
        // assertEq(counter.number(), x);

        uint256 messageInt = uint256(keccak256(abi.encodePacked('hello')));
        assertEq(messageInt, 12910348618308260923200348219926901280687058984330794534952861439530514639560);
    }
}
