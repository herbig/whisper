import { Link, LinkProps } from "@chakra-ui/react";
import { useNetwork } from "wagmi";

interface Props extends LinkProps {
    address: string;
}

export function EtherscanLink({ children, address, ...rest }: Props) {
    const { chain } = useNetwork();
    // TODO this doesn't actually work, just need to have a map of scans
    const chainName = chain?.id === 1 ? '' : chain?.name + '.';
    const href = `https://${chainName}etherscan.io/address/${address}`;
    return (
        <Link {...rest} href={href} isExternal>{children}</Link>
    );
}