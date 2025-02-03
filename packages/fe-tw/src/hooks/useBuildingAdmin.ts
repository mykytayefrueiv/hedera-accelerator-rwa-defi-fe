import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { buildingFactoryAddress } from "@/services/contracts/addresses";
import { useWriteContract, useWatchTransactionReceipt } from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";

export type CreateERC3643TokenPayload = {
    tokenName: string;
    tokenSymbol: string;
};

export const useBuildingAdmin = (buildingAddress: `0x${string}`) => {
    const { writeContract } = useWriteContract();
    const { watch } = useWatchTransactionReceipt();

    const createNewBuilding = (tokenUri: string): Promise<string> => {
        return new Promise((res, rej) => {
            writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, buildingFactoryAddress),
                abi: buildingFactoryAbi,
                functionName: "newBuilding",
                args: [tokenUri],
            }).then(tx => {
                watch(tx as string, {
                    onSuccess: (transaction) => {
                        res(transaction.transaction_id)

                        return transaction;
                    },
                    onError: (transaction, err) => {
                        rej(err)

                        return transaction;
                    },
                })
            }).catch(err => {
                rej(err);
            });
        });
    };

    const createBuildingERC3643Token = (payload: CreateERC3643TokenPayload): Promise<string> => {
        return new Promise((res, rej) => {
            writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, buildingFactoryAddress),
                abi: buildingFactoryAbi,
                functionName: "newERC3643Token",
                args: [buildingAddress, payload.tokenName, payload.tokenSymbol, 18],
            }).then(tx => {
                watch(tx as string, {
                    onSuccess: (transaction) => {
                        res(transaction.transaction_id)

                        return transaction;
                    },
                    onError: (transaction, err) => {
                        rej(err)

                        return transaction;
                    },
                })
            }).catch(err => {
                rej(err);
            });
        });
    };

    return { createBuildingERC3643Token, createNewBuilding };
};
