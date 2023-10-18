import { Identity } from "@semaphore-protocol/identity";
import { useAccount, useContractWrite, usePrepareContractWrite, useSignMessage, useWaitForTransaction } from "wagmi";
import { readContract } from 'wagmi/actions'
import { getValue, setValue, CacheExpiry, CacheKeys } from "./cache";
import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import { generateProof } from "@semaphore-protocol/proof";
import { Group } from "@semaphore-protocol/group";
import { SemaphoreSubgraph } from "@semaphore-protocol/data";
import { BigNumber } from "ethers";
import web3 from "web3/lib/commonjs/web3";

// TODO support mainnet deploy
export const MESSAGE_BOARD_ADDRESS = '0x6eb4d090c7b7e39bdc3084faa485e00c999a3069';
export const MESSAGE_BOARD_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"AlreadyAMember","type":"error"},{"inputs":[],"name":"CantLeave","type":"error"},{"inputs":[],"name":"InvalidDeposit","type":"error"},{"inputs":[],"name":"NotAHolder","type":"error"},{"inputs":[],"name":"NotAMember","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"tokenAddress","type":"address"},{"indexed":false,"internalType":"address","name":"poster","type":"address"},{"indexed":false,"internalType":"string","name":"message","type":"string"}],"name":"MessagePosted","type":"event"},{"inputs":[],"name":"DEPOSIT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"}],"name":"getGroupId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"groups","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"identities","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"identityCommitment","type":"uint256"}],"name":"joinGroup","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"address","name":"memberAddress","type":"address"},{"internalType":"uint256[]","name":"proofSiblings","type":"uint256[]"},{"internalType":"uint8[]","name":"proofPathIndices","type":"uint8[]"}],"name":"leaveGroup","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"string","name":"message","type":"string"},{"internalType":"uint256","name":"merkleTreeRoot","type":"uint256"},{"internalType":"uint256","name":"nullifierHash","type":"uint256"},{"internalType":"uint256[8]","name":"proof","type":"uint256[8]"}],"name":"postMessage","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"semaphore","outputs":[{"internalType":"contract ISemaphore","name":"","type":"address"}],"stateMutability":"view","type":"function"}];

export function useMessageBoard(tokenAddress: string) {
    const { data: signMessageData, signMessage, variables } = useSignMessage();
    const [ button, setButton ] = useState<{
        label: string;
        onClick: MouseEventHandler<HTMLButtonElement> | undefined;
    }>();
    const [ idCreated, setIdCreated ] = useState<boolean>(false);
    const { address } = useAccount();
    const [ commitment, setCommitment ] = useState<bigint>(BigInt('0'));
    const { joinGroup, isLoading } = useAddCommitment(tokenAddress, commitment);

    useEffect(() => {
        const fetchState = async () => {
            const identityStr: string = getValue(CacheKeys.SEMAPHORE_ID + tokenAddress + address);
            console.log('identityStr ' + identityStr);
            const identity = identityStr ? new Identity(identityStr) : undefined;

            if (!address) {
                setButton(undefined);
            } else if (!identity) {
                setButton({ label: 'Get ID', onClick: () => {
                    signMessage({ message: 'whisperId:' + address + ':' + tokenAddress });
                }});
            } else {
                setCommitment(identity.commitment);

                const hasJoined = await readContract({
                    address: MESSAGE_BOARD_ADDRESS,
                    abi: MESSAGE_BOARD_ABI,
                    functionName: 'identities',
                    args: [tokenAddress, address],
                });

                if (hasJoined) {
                    setButton(undefined);
                } else {
                    if (joinGroup) {
                        setButton({ label: 'Join Board', onClick: () => {
                            joinGroup();
                        }});
                    } else {
                        setButton({ label: 'Join Board', onClick: undefined});
                    }
                }
            }
        }
        fetchState(); // TODO error handling
    }, [address, signMessage, tokenAddress, idCreated, joinGroup, isLoading]);

    useEffect(() => {
        if (variables?.message && signMessageData) {
            setValue(CacheKeys.SEMAPHORE_ID + tokenAddress + address, new Identity(signMessageData).toString(), CacheExpiry.NEVER);
            setIdCreated(true);
        }
      }, [tokenAddress, signMessageData, variables?.message, address]
    );

    return { button };
}

export function useAddCommitment(tokenAddress: string, commitment: bigint) {
    const { config } = usePrepareContractWrite({
      address: MESSAGE_BOARD_ADDRESS,
      abi: MESSAGE_BOARD_ABI,
      functionName: 'joinGroup',
      value: BigInt('10000000000000000'),
      args: [tokenAddress, commitment],
    });
    const { data, write } = useContractWrite(config);
    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    });
    
    return { joinGroup: write, isLoading };
}

export function useGenerateProof() {
    const { address } = useAccount();

    const getProof = useCallback(async (tokenAddress: string, message: string) => {
        const identityStr: string = getValue(CacheKeys.SEMAPHORE_ID + tokenAddress + address);
        const identity = identityStr ? new Identity(identityStr) : undefined;

        const messageInt: BigNumber = BigNumber.from(web3.utils.soliditySha3(message));
        console.log('messageInt ' + messageInt);

        if (identity) {

            const groupId = await readContract({
                address: MESSAGE_BOARD_ADDRESS,
                abi: MESSAGE_BOARD_ABI,
                functionName: 'getGroupId',
                args: [tokenAddress],
            }) as bigint;

            console.log('groupId ' +  groupId);

            const semaphoreSubgraph = new SemaphoreSubgraph("goerli")
            const { members } = await semaphoreSubgraph.getGroup(groupId.toString(), { members: true });

            const group = new Group(1, 20, members);
            const externalNullifier = group.root;

            const proof = await generateProof(identity, group, externalNullifier, messageInt);

            return proof;
        }
    }, [address]);

    return getProof;
}

    // function postMessage(
    //     address tokenAddress,
    //     uint256 message,
    //     uint256 merkleTreeRoot,
    //     uint256 nullifierHash,
    //     uint256[8] calldata proof
    // )
export function usePostMessage(tokenAddress: string) {
    const { config } = usePrepareContractWrite({
      address: MESSAGE_BOARD_ADDRESS,
      abi: MESSAGE_BOARD_ABI,
      functionName: 'postMessage',
      args: [tokenAddress],
    });
    const { data, write } = useContractWrite(config);
    const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
    });
    
    return { postMessage: write, isLoading };
}