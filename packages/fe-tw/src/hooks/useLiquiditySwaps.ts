import { uniswapRouterAbi } from "@/services/contracts/abi/uniswapRouterAbi";
import { uniswapRouterAddress } from "@/services/contracts/addresses";
import { useWriteContract, useWatchTransactionReceipt, useEvmAddress } from "@buidlerlabs/hashgraph-react-wallets";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { useEffect, useState } from "react";
import { ContractId } from "@hashgraph/sdk";
import { buildingAbi } from "@/services/contracts/abi/buildingAbi";
import { QueryData, SwapLiquidityPair, SwapTokensRequestBody, AddLiquidityRequestBody, SwapTradeItem } from "@/types/erc3643/types";

// todo: use building tokens and liquidity
const ERC20_TOK_1 = '0x55aF16fa6792E78329B622cA7D231C4Cd0dF5f44';
const ERC2O_USDC = '0x0000000000000000000000000000000000068cda';

export const useLiquiditySwaps = (buildingAddress: `0x${string}`) => {
    const { writeContract } = useWriteContract();
    const { watch } = useWatchTransactionReceipt();
    const { data: evmAddress } = useEvmAddress();

    const [liquidityPairs, setLiquidityPairs] = useState<SwapLiquidityPair[]>([{
        tokenA: ERC20_TOK_1,
        tokenB: ERC2O_USDC,
    }]);
    const [tradeHistory, setTradeHistory] = useState<SwapTradeItem[]>([]);
    const [isSwapTokensLoading, setIsSwapTokensLoading] = useState(false);
    const [isSwapTokensError, setIsSwapTokensError] = useState(false);
    const [isAddLiquidityLoading, setAddLiquidityLoading] = useState(false);
    const [isAddLiquidityError, setAddLiquidityError] = useState(false);

    const fetchUniswapAccountTxHistory = async () => {
        const response = await fetch(`https://testnet.mirrornode.hedera.com/api/v1/contracts/${uniswapRouterAddress}/results`);
        const responseAsJSON = await response.json();

        setTradeHistory(responseAsJSON.results);
    };

    useEffect(() => {
        fetchUniswapAccountTxHistory();
    }, []);

    const handleSwapTokens = async (body: SwapTokensRequestBody): Promise<{ transaction_id: string }> => {
        return new Promise((res, rej) => {
            const args = [body.amountOut, body.amountIn, body.path, evmAddress, body.deadline || 10000];

            setIsSwapTokensLoading(true);
            writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, uniswapRouterAddress),
                abi: uniswapRouterAbi,
                functionName: "swapTokensForExactTokens",
                args,
            }).then(tx => {
                watch(tx as string, {
                    onSuccess: (transaction) => {
                        setIsSwapTokensLoading(false);
                        res(transaction);

                        return transaction;
                    },
                    onError: (transaction, err) => {
                        setIsSwapTokensError(true);
                        rej(err);

                        return transaction;
                    },
                })
            }).catch(err => {
                rej(err);
            });
        })
    };

    const handleAddLiquidity = (body: AddLiquidityRequestBody) => {
        return new Promise((res, rej) => {
            const args = [body.tokenA, body.tokenAAmount, body.tokenB, body.tokenBAmount];

            setAddLiquidityLoading(true);
            writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, buildingAddress as `0x${string}`),
                abi: buildingAbi,
                functionName: "addLiquidity",
                args,
            }).then(tx => {
                watch(tx as string, {
                    onSuccess: (transaction) => {
                        setAddLiquidityLoading(false);
                        res(transaction);

                        return transaction;
                    },
                    onError: (transaction, err) => {
                        setAddLiquidityError(true);
                        rej(err);

                        return transaction;
                    },
                })
            }).catch(err => {
                rej(err);
            });
        });
    };

    return {
        tradeHistory,
        liquidityPairs,
        isSwapTokensError,
        isSwapTokensLoading,
        isAddLiquidityError,
        isAddLiquidityLoading,
        handleAddLiquidity,
        handleSwapTokens,
    };
};
