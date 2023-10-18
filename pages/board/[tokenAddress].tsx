import { Flex, Center } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { isAddress } from 'web3-validator';
import { MessageInput } from "./components/MessageInput";
import { MessageRow } from "./components/MessageRow";
import { Board404 } from "./components/Board404";
import Head from "next/head";
import { NavBoard } from "./components/NavBoard";
import { useContractEvent } from "wagmi";
import { truncateEthAddress } from "../utils/utils";
import { MESSAGE_BOARD_ADDRESS, MESSAGE_BOARD_ABI } from "../utils/messageBoard";

export default function Board() {
  const { asPath } = useRouter();
  const address = asPath.substring(asPath.lastIndexOf('/') + 1, asPath.length);
  useContractEvent({
    address: MESSAGE_BOARD_ADDRESS,
    abi: MESSAGE_BOARD_ABI,
    eventName: 'MessagePosted',
    listener(log) {
      console.log('MessagePosted ' + log)
    },
  });

  if (!isAddress(address)) { // TODO also check that it's a token address
    return <Board404 path={address} />;
  }

  const truncatedAddress = truncateEthAddress(address);

  return (
    <Center p='3rem' bg='#f6f6ef' flexDirection='column'>
      <Head><title>Token {truncatedAddress}</title></Head>

      <NavBoard tokenAddress={address} />

      <Flex flexDirection='column' w='full' ps='4rem' pe='4rem'>
        
        <MessageInput tokenAddress={address} />

        {stubData.map((data, index) => {
          return (
            <MessageRow 
              key={index} 
              time={data.time} 
              address={data.userAddress} 
              message={data.message}  />
          );
        })}
      </Flex>
    </Center>
  );
}

interface Message {
  time: string;
  userAddress: string;
  message: string;
}

const stubData: Message[] = [
  {
    time: '1696620642',
    userAddress: '0x8E2695650D09FD940516d6e050D0Ba87d8deF032',
    message: 'Hello!'
  },
  {
    time: '1696620642',
    userAddress: '0x8E2695650D09FD940516d6e050D0Ba87d8deF032',
    message: 'Another test message what does this look like?'
  },
  {
    time: '1696620642',
    userAddress: '0x8E2695650D09FD940516d6e050D0Ba87d8deF032',
    message: 'This NFT is pretty sweet.'
  },
  {
    time: '1696620642',
    userAddress: '0x8E2695650D09FD940516d6e050D0Ba87d8deF032',
    message: 'I dont get this what should I post here?'
  },
  {
    time: '1696620642',
    userAddress: '0x8E2695650D09FD940516d6e050D0Ba87d8deF032',
    message: 'The US gov faked the moon landing and I have proof.'
  },
  {
    time: '1696620642',
    userAddress: '0x8E2695650D09FD940516d6e050D0Ba87d8deF032',
    message: 'I suppose I should write something insightful but Im out of ideas'
  },
  {
    time: '1696620642',
    userAddress: '0x8E2695650D09FD940516d6e050D0Ba87d8deF032',
    message: 'first'
  },
];