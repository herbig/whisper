
/**
 * Returns a truncated eth address in the familiar '0x123...456' form.
 */
export function truncateEthAddress(address: string): string {
    return address.substring(0, 5) + '...' + address.substring(address.length - 3);
}