"use client";

import { oneSidedExchangeAbi } from '@/services/contracts/abi/oneSidedExchangeAbi';
import { oneSidedExchangeAddress } from '@/services/contracts/addresses';
import { useWriteContract, useWatchTransactionReceipt } from '@buidlerlabs/hashgraph-react-wallets';
import { useState } from "react";
import { ContractId } from "@hashgraph/sdk";

// todo
export const useOneSidedExchange = () => {
    const { writeContract } = useWriteContract();
    const { watch } = useWatchTransactionReceipt();

    const [tradeHistory, setTradeHistory] = useState([]);

    const isLoading = false;
    const isError = false;

    const handleSellToken = async () => {
        return new Promise((res, rej) => {
            writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, oneSidedExchangeAddress),
                abi: oneSidedExchangeAbi,
                functionName: "swap",
                args: [],
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

    const handleBuyToken = async () => {
        return new Promise((res, rej) => {
            writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, oneSidedExchangeAddress),
                abi: oneSidedExchangeAbi,
                functionName: "swap",
                args: [],
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
        tradeHistory,
        isLoading,
        isError,
        handleBuyToken,
        handleSellToken,
    };
};
