"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { ethers } from "ethers";
import Select from "react-select";
import { useOneSidedExchangeSwaps } from "@/hooks/useOneSidedExchangeSwaps";
import { ONE_ERC2O_TOKEN_18decimals } from "@/consts/trade";
import { TransactionLink } from "../Transactions/TransactionLink";

type Props = {
    buildingTokens: `0x${string}`[];
}

const colourStyles = {
    control: (styles: object) => ({ ...styles, backgroundColor: '#fff' }),
    option: (styles: any) => {
        return {
            ...styles,
            backgroundColor: '#fff',
            color: '#000',

            ':active': {
                ...styles[':active'],
                backgroundColor: '#9333ea36',
            },

            ':focused': {
                backgroundColor: '#9333ea36',
            }
        };
    },
    placeholder: (styles: object) => ({ ...styles, color: '#9333ea9e' }),
};

export default function TradeFormOneSidedExchange({ buildingTokens }: Props) {
    const { checkBalanceOfLiquidityToken, handleSwapTokens, estimateTokensSwapSpendings } = useOneSidedExchangeSwaps();
    const [txResult, setTxResult] = useState<string>('0x12345');
    const [txError, setTxError] = useState<string>();
    const [maxSwapTokenAmount, setMaxSwapTokenAmount] = useState<bigint>();
    const [tradeFormData, setTradeFormData] = useState({
        amount: '',
        tokenA: '',
        tokenB: '',
    });

    const checkIfSwapAllowed = async () => {
        const { tokenA, tokenB, amount } = tradeFormData;
        const exchangeTokenBalance = await checkBalanceOfLiquidityToken(tokenB as `0x${string}`);
        const [_, tokenBAmount] = await estimateTokensSwapSpendings(tokenA as `0x${string}`, tokenB as `0x${string}`, ethers.parseEther(amount.toString()));

        if (exchangeTokenBalance >= tokenBAmount) {
            return true;
        } else {
            toast.error(`Not enough token balance to make a swap, it has only ${exchangeTokenBalance / ONE_ERC2O_TOKEN_18decimals}`);
            setMaxSwapTokenAmount(exchangeTokenBalance / ONE_ERC2O_TOKEN_18decimals);

            return false;
        }
    };

    const handleSwapSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const amount = tradeFormData.amount;
        const tokenB = tradeFormData.tokenB;

        if (!amount || !tradeFormData.tokenA || !tokenB) {
            toast.error('All fields in trade form are required');
        } else {
            try {
                setTxError('');
                setTxResult('');

                const isSwapAllowed = await checkIfSwapAllowed();

                if (isSwapAllowed) {
                    const transactionId = await handleSwapTokens({
                        tokenA: tradeFormData.tokenA,
                        tokenB: tokenB,
                        amount: ethers.parseEther(amount.toString()),
                    });

                    toast.success(`Successfully sold ${amount} tokens for ${tokenB}!`);
                    setTradeFormData({
                        amount: '',
                        tokenA: '',
                        tokenB: '',
                    });
                    setTxResult(transactionId);
                }
            } catch (err) {
                toast.error(`Failed to sell tokens: ${(err as { message: string })?.message}`);
                setTxError(err?.toString());
            }
        }
    };

    useEffect(() => {
        setMaxSwapTokenAmount(undefined);
    }, [tradeFormData]);

    return (
        <div className="flex-1 flex-col gap-4 w-6/12">
            <form
                onSubmit={handleSwapSubmit}
                className="bg-white rounded-lg p-10 border border-gray-300"
            >
                <h1 className="text-2xl font-bold mb-4">Swap Token</h1>
                <span className="text-sm text-gray-900">
                    Select a building token you hold and swap it for another building token or USDC
                </span>
                <div>
                    <label className="text-gray-500 text-md block mb-1 font-semibold" htmlFor="tokenASelect">
                        Select token A
                    </label>
                    <Select
                        placeholder="Token A"
                        onChange={(value) => {
                            setTradeFormData(prev => ({
                                ...prev,
                                tokenA: value?.value as `0x${string}`,
                            }))
                        }}
                        options={buildingTokens.map(token => ({
                            value: token,
                            label: token,
                        }))}
                        styles={colourStyles}
                    />
                </div>
                <div>
                    <label className="text-gray-500 text-md block mb-1 font-semibold" htmlFor="tokenBSelect">
                        Select token B
                    </label>
                    <Select
                        onChange={(value) => {
                            setTradeFormData(prev => ({
                                ...prev,
                                tokenB: value?.value as `0x${string}`,
                            }))
                        }}
                        options={buildingTokens.map(token => ({
                            value: token,
                            label: token,
                        }))}
                        styles={colourStyles}
                        placeholder="Token B"
                    />
                </div>
                <div className="mb-5">
                    <label className="text-gray-500 text-md block mb-1 font-semibold" htmlFor="amount">
                        Amount of tokens to sell
                    </label>
                    <input
                        id="amount"
                        value={tradeFormData.amount}
                        onChange={(e) => setTradeFormData((prev) => ({
                            ...prev,
                            amount: e.target.value,
                        }))}
                        className="input input-bordered w-full py-7 text-2xl"
                        placeholder="e.g. 10"
                        required
                    />
                    {maxSwapTokenAmount ? <span>{maxSwapTokenAmount}</span> : <></>}
                </div>
                <button
                    type="submit"
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full"
                >
                    Swap tokens
                </button>
                {txResult && <div className="flex mt-10">
                    <p className="text-xl font-bold text-purple-600">
                        <TransactionLink hash={txResult} />
                    </p>
                </div>}
                {txError && <div className="flex mt-10">
                    <p className="text-xl font-bold text-purple-600">
                        Deployed Tx Error: {txError}
                    </p>
                </div>}
            </form>
        </div>
    );
}
