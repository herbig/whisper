import { Box, Text, Flex, Spacer, Card, Image, SimpleGrid, Input, HStack, VStack, Center, Button, InputGroup, InputRightElement } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { EtherscanLink } from './board/components/EtherscanLink';
import Link from 'next/link';
import { Btn } from './board/components/Btn';
import { Crd } from './board/components/Crd';

const Home: NextPage = () => {
  return (
    <Box p='3rem' bg='#f6f6ef' flexDirection='column' h='100vh'>
      <Head><title>Token Boards</title></Head>

      <Flex mb='1rem' w='full'>
        <Text fontSize='2xl' as='b'>Token Boards</Text>
        <Spacer />
        <ConnectButton />
      </Flex>

      <Flex m='4rem' flexDirection='column'>
        <Text fontSize='2xl' as='b' mb='1rem'>Featured Tokens</Text>
        <SimpleGrid columns={{ sm: 2, md: 3, lg: 5 }} gap='1rem'>
          {features.map((data, index) => {
              return (
                <FeatureCard
                  key={index} 
                  name={data.name} 
                  address={data.address} 
                  imageUrl={data.imageUrl} />
              );
            })}
        </SimpleGrid>
      </Flex>

      <Flex ms='4rem' me='4rem' mb='4rem' flexDirection='column'>
        <Text fontSize='2xl' as='b' mb='1rem'>Search for a token</Text>
        <InputGroup size='md'>
          <Input
            borderRadius='xl'
            borderColor='blackAlpha.500'
            placeholder='0x000...000'
          />
          <InputRightElement w='4rem'>
            <Btn h='1.75rem' size='sm'>
              Go
            </Btn>
          </InputRightElement>
        </InputGroup>
      </Flex>
    </Box>
  );
};

function FeatureCard({ name, address, imageUrl }: {name: string; address: string; imageUrl: string}) {
  return (
    <Link href={'/board/' + address}>
      <Crd>
        <Image
          src={imageUrl}
          alt={name}
          borderRadius='xl' />
        <Text as='b' mt='1rem'>{name}</Text>
      </Crd>
    </Link>
  );
}

const features: FeaturedToken[] = [
  {
    name: 'TEST',
    address: '0xc6130d7ea0DD5cC9D6AaC767B10058D28d9E1cE1',
    imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/how-to-keep-ducks-call-ducks-1615457181.jpg'
  },
  {
    name: 'USDC',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    imageUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png'
  },
  {
    name: 'BAYC',
    address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
    imageUrl: 'https://pbs.twimg.com/media/FD_-DjdXwAYsCml.jpg'
  },
  {
    name: 'BAYC',
    address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
    imageUrl: 'https://pbs.twimg.com/media/FD_-DjdXwAYsCml.jpg'
  },
  {
    name: 'BAYC',
    address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
    imageUrl: 'https://pbs.twimg.com/media/FD_-DjdXwAYsCml.jpg'
  },
];

interface FeaturedToken {
  name: string;
  address: string;
  imageUrl: string;
}

export default Home;
