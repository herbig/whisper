import { Text, Flex, FlexProps, HStack, IconButton, Spacer } from "@chakra-ui/react";
import { Btn } from "./Btn";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaArrowLeft } from "react-icons/fa";
import { truncateEthAddress, useMessageBoard } from "../../utils";

interface Props extends FlexProps {
    tokenAddress: string;
}

export function NavBoard({ tokenAddress, ...rest }: Props) {
    const { button } = useMessageBoard(tokenAddress);

    return (
        <Flex mb='1rem' w='full' {...rest}>
            <HStack>
                <Link href='/'>
                    <IconButton variant='ghost' aria-label={'Back'}>
                        <FaArrowLeft />
                    </IconButton>
                </Link>
                <Text fontSize='2xl' as='b'>
                    Token {truncateEthAddress(tokenAddress)}
                </Text>
            </HStack>
            <Spacer />
            {button && <Btn me='0.8rem' isDisabled={button.onClick ? false : true} onClick={button.onClick}>{button.label}</Btn>}
            <ConnectButton />
        </Flex>
    );
  }