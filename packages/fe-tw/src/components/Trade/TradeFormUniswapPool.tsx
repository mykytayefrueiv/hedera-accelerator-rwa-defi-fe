"use client";

import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { ethers } from "ethers";
import Select, { SingleValue } from "react-select";
import { useUniswapTradeSwaps } from "@/hooks/swaps/useUniswapTradeSwaps";

type Props = {
    buildingTokens: `0x${string}`[];
};

const colourStyles = {
    control: (styles: object) => ({ ...styles, backgroundColor: '#fff', paddingTop: 4, paddingBottom: 4 }),
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

export default function TradeFormUniswapPool({ buildingTokens }: Props) {
    const { handleSwap } = useUniswapTradeSwaps();
    const [txResult, setTxResult] = useState<string>();
    const [txError, setTxError] = useState<string>();
    const [tradeFormData, setTradeFormData] = useState({
        amount: 0,
        tokenA: '',
        tokenB: '',
    });

    const buildingTokensOptions = useMemo(() => buildingTokens.map(token => ({
        value: token,
        label: token,
    })), []);

    const handleSwapSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const amount = tradeFormData.amount;
        const tokenB = tradeFormData.tokenB;

        if (!amount || !tradeFormData.tokenA || !tradeFormData.tokenB) {
            toast.error('All fields in trade form are required');
        } else {
            try {
                const transaction_id = await handleSwap({
                    amountIn: ethers.parseEther(amount.toString()),
                    amountOut: ethers.parseEther(amount.toString()),
                    path: [tradeFormData.tokenA, tradeFormData.tokenB],
                });
                setTradeFormData({
                    amount: 0,
                    tokenA: '',
                    tokenB: '',
                });

                toast.success(`Successfully sold ${amount} tokens for ${tokenB}!`);
                setTxResult(transaction_id);
            } catch (err) {
                toast.error(`Failed to sell tokens: ${(err as { message: string })?.message}`);
                setTxError((err as unknown as { message: string }).message);
            }
        }
    };

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
                <div className="mt-5">
                    <label className="text-gray-500 text-md block mb-1 font-semibold" htmlFor="tokenASelect">
                        Select token A
                    </label>
                    <Select
                        styles={colourStyles}
                        onChange={(value) => {
                            setTradeFormData(prev => ({
                                ...prev,
                                tokenA: value?.value as `0x${string}`,
                            }))
                        }}
                        options={buildingTokensOptions}
                    />
                </div>
                <div>
                    <label className="text-gray-500 text-md block mb-1 font-semibold" htmlFor="tokenBSelect">
                        Select token B
                    </label>
                    <Select
                        styles={colourStyles}
                        onChange={(value) => {
                            setTradeFormData(prev => ({
                                ...prev,
                                tokenB: value?.value as `0x${string}`,
                            }))
                        }}
                        options={buildingTokensOptions}
                    />
                </div>
                <div className="mb-5">
                    <label className="text-gray-500 text-md block mb-1 font-semibold" htmlFor="amount">
                        Amount of tokens to sell
                    </label>
                    <input
                        id="amount"
                        type="number"
                        value={tradeFormData.amount}
                        onChange={(e) => setTradeFormData((prev) => ({
                            ...prev,
                            amount: !e.target.value ? 0 : parseFloat(e.target.value),
                        }))}
                        className="input input-bordered w-full text-sm"
                        placeholder="e.g. 10"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full"
                >
                    Swap tokens
                </button>
            </form>
            {txResult && <div className="flex">
                <p className="text-sm font-bold text-purple-600">
                    Deployed Tx Hash: {txResult}
                </p>
            </div>}
            {txError && <div className="flex">
                <p className="text-sm font-bold text-purple-600">
                    Deployed Tx Error: {txError}
                </p>
            </div>}
        </div>
    );
}
