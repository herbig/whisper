import { Card, CardProps, Flex, Text } from "@chakra-ui/react";
import { truncateEthAddress } from "../../utils/utils";
import { EtherscanLink } from "./EtherscanLink";
import { Crd } from "./Crd";

interface Props extends CardProps {
    time: string;
    address: string;
    message: string
}

export function MessageRow({ time, address, message, ...rest }: Props) {
    return (
      <Crd mb='1rem' {...rest}>
        <Flex flexDirection='column'>
            <Text fontSize='sm'>
                {new Date(Number(time) * 1000).toString()} by <EtherscanLink address={address}>{truncateEthAddress(address)}</EtherscanLink>
            </Text>
            <Text mt='0.5rem'>{message}</Text>
        </Flex>
      </Crd>
    );
}