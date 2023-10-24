import { Button, Card, CardProps, Flex, Spacer, Textarea } from "@chakra-ui/react";
import { Btn } from "./Btn";
import { Crd } from "./Crd";
import { useState } from "react";
import { usePostMessage } from "../../utils/messageBoard";

interface Props extends CardProps {
  tokenAddress: string;
}

export function MessageInput({ tokenAddress, ...rest }: Props) {
    const [ value, setValue ] = useState<string>('');
    const { postMessage } = usePostMessage(tokenAddress);

    const onSubmit = async () => {
      const proof = postMessage(value);
    };

    return (
      <Crd mb='1rem' mt='1rem' {...rest}>
        <Textarea
          border='none'
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder='Type something insightful...' />
         <Flex>
            <Spacer />
            <Btn w='5rem' mt='1rem' colorScheme='gray' onClick={onSubmit} isDisabled={value.length === 0}>Submit</Btn>
        </Flex>
      </Crd>
    );
  }