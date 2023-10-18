import { Card, CardProps } from "@chakra-ui/react";

export function Crd({ children, ...rest }: CardProps) {
    return (
        <Card borderRadius='xl' padding='1rem' {...rest}>{children}</Card>
    );
}