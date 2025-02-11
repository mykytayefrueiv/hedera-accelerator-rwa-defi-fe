import { pythOracleAddress, uniswapRouterAddress, usdcAddress } from "@/services/contracts/addresses";
import { sliceFactoryAbi } from '@/services/contracts/abi/sliceFactoryAbi';
import { SLICE_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { useWriteContract, useWatchTransactionReceipt } from '@buidlerlabs/hashgraph-react-wallets';
import * as uuid from 'uuid';
import { ContractId } from "@hashgraph/sdk";

export function useCreateSlice() {
    const { writeContract } = useWriteContract();
    const { watch } = useWatchTransactionReceipt();

    const handleCreateSlice = async () => {
        return new Promise((res, rej) => {
            const sliceDetails = {
                pyth: pythOracleAddress,
                uniswapRouter: uniswapRouterAddress,
                usdc: usdcAddress,
            };

            writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, SLICE_FACTORY_ADDRESS),
                abi: sliceFactoryAbi,
                functionName: "deploySlice",
                args: [uuid.v4(), sliceDetails],
            }).then(tx => {
                watch(tx as string, {
                    onSuccess: (transaction) => {
                        res(transaction)

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
        })
    };

    return {
        handleCreateSlice,
    };
}
