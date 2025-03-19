import {
	useWriteContract,
    useWatchTransactionReceipt
} from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { useEffect, useState } from "react";
import { buildingAbi } from "@/services/contracts/abi/buildingAbi";

export const useGovernanceAndTreasuryDeployment = (buildingAddress?: `0x${string}`, buildingTokenAddress?: `0x${string}`) => {
    const { writeContract } = useWriteContract();
    const { watch } = useWatchTransactionReceipt();
    const [treasuryAddress, setTreasuryAddress] = useState<`0x${string}`>();

    useEffect(() => {
        watchContractEvent({
            address: BUILDING_FACTORY_ADDRESS as `0x${string}`,
            abi: buildingAbi,
            eventName: 'NewGovernance',
            onLogs: (data) => {
                console.log('deployed', data)
            },
        });
    }, []);
    
    const deployBuildingGovernance = ({ governanceName }: { governanceName: string }): Promise<string> => {
        return new Promise((res, rej) => {
            writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
                abi: buildingFactoryAbi,
                functionName: "newGovernance",
                args: [buildingAddress, governanceName, buildingTokenAddress, treasuryAddress],
            }).then((tx) => {
                watch(tx as string, {
                    onSuccess: (transaction) => {
                        res(transaction.transaction_id);
            
                        return transaction;
                    },
                    onError: (transaction, err) => {
                        rej(err);
            
                        return transaction;
                    },
                });
            }).catch((err) => {
                rej(err);
            });
        });
    };

    const deployBuildingTreasury = ({ reserve, npercentage }: { reserve: string, npercentage: string }): Promise<string> => {
        return new Promise((res, rej) => {
            writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
                abi: buildingFactoryAbi,
                functionName: "newTreasury",
                args: [buildingAddress, buildingTokenAddress, parseInt(reserve, 10), parseInt(npercentage, 10)],
            }).then((tx) => {
                watch(tx as string, {
                    onSuccess: (transaction) => {
                        res(transaction.transaction_id);
            
                        return transaction;
                    },
                    onError: (transaction, err) => {
                        rej(err);
            
                        return transaction;
                    },
                });
            }).catch((err) => {
                rej(err);
            });
        });
    };

    return { deployBuildingGovernance, deployBuildingTreasury, treasuryAddress };
};
