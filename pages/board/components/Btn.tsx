import { Button, ButtonProps } from "@chakra-ui/react";

export function Btn({ children, ...rest }: ButtonProps) {
    return (
        <Button borderRadius='xl' colorScheme='green' boxShadow='lg' {...rest}>{children}</Button>
    );
}