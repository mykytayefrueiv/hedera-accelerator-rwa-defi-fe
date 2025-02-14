import { PYTH_ORACLE_ADDRESS, UNISWAP_ROUTER_ADDRESS, USDC_ADDRESS } from "@/services/contracts/addresses";
import { sliceFactoryAbi } from '@/services/contracts/abi/sliceFactoryAbi';
import { SLICE_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { CreateSliceRequestBody } from "@/types/erc3643/types";
import { uploadJsonToPinata } from "@/services/ipfsService";
import { useWriteContract, useWatchTransactionReceipt } from '@buidlerlabs/hashgraph-react-wallets';
import { ContractId } from "@hashgraph/sdk";
import * as uuid from 'uuid';

export function useCreateSlice() {
    const { writeContract } = useWriteContract();
    const { watch } = useWatchTransactionReceipt();

    const handleCreateSlice = async (data: CreateSliceRequestBody): Promise<string> => {
        return new Promise((res, rej) => {
            uploadJsonToPinata<CreateSliceRequestBody>(data, `Slice-${data.name}`).then(ipfsHash => {
                const sliceDetails = {
                    pyth: PYTH_ORACLE_ADDRESS,
                    uniswapRouter: UNISWAP_ROUTER_ADDRESS,
                    usdc: USDC_ADDRESS,
                    ipfsHash,
                };

                writeContract({
                    contractId: ContractId.fromEvmAddress(0, 0, SLICE_FACTORY_ADDRESS),
                    abi: sliceFactoryAbi,
                    functionName: "deploySlice",
                    args: [uuid.v4(), sliceDetails], // todo: use IPFS uri hash insertion here
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
        })
    };

    return {
        handleCreateSlice,
    };
}
