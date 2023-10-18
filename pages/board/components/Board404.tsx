import { Center, Text, Button } from "@chakra-ui/react";
import Head from "next/head";
import Link from "next/link";
import { Btn } from "./Btn";

export function Board404({ path }: { path: string }) {
    return (
        <Center bg='#f6f6ef' h='100vh' flexDirection='column' gap='1rem'>
            <Head><title>404</title></Head>
            <Text fontSize='5xl' as='b'>404</Text>
            <Text fontSize='xl'>{path} is not a valid Ethereum address.</Text>
            <Link href="/"><Btn>Go home</Btn></Link>
        </Center>
    );
}