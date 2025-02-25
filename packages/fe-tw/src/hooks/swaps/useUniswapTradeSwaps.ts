import { uniswapRouterAbi } from "@/services/contracts/abi/uniswapRouterAbi";
import { UNISWAP_ROUTER_ADDRESS } from "@/services/contracts/addresses";
import { SwapUniswapTokensRequestBody } from "@/types/erc3643/types";
import { useWriteContract, useWatchTransactionReceipt, useEvmAddress } from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";

export const useUniswapTradeSwaps = () => {
    const { watch } = useWatchTransactionReceipt();
    const { writeContract } = useWriteContract();
    const { data: evmAddress } = useEvmAddress();

    const handleSwap = async (payload: SwapUniswapTokensRequestBody): Promise<string> => {
        return new Promise((res, rej) => {
            writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, UNISWAP_ROUTER_ADDRESS),
                abi: uniswapRouterAbi,
                functionName: "swapExactTokensForTokens",
                args: [payload.amountIn, payload.amountOut, payload.path, evmAddress, payload.deadline],
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

    return { handleSwap };
};
