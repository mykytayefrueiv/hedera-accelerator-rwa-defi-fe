"use client";

import React, { useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import Select from "react-select";
import { useUniswapTradeSwaps } from "@/hooks/useUniswapTradeSwaps";
import { colourStyles } from "@/consts/theme";
import { oneHourTimePeriod } from "@/consts/trade";
import { USDC_ADDRESS } from "@/services/contracts/addresses";
import { getTokenDecimals } from "@/services/erc20Service";

type Props = {
    buildingTokens: `0x${string}`[];
};

export default function TradeFormUniswapPool({ buildingTokens }: Props) {
    const { handleSwap, getAmountsOut, giveAllowance } = useUniswapTradeSwaps();
    const [txResult, setTxResult] = useState<string>();
    const [txError, setTxError] = useState<string>();
    const [tradeFormData, setTradeFormData] = useState<{
        amount?: string,
        tokenA?: `0x${string}`,
        tokenB?: `0x${string}`,
        autoRevertsAfter: number,
    }>({
        amount: undefined,
        tokenA: undefined,
        tokenB: USDC_ADDRESS,
        autoRevertsAfter: oneHourTimePeriod,
    });

    const buildingTokensOptions = useMemo(() => [...buildingTokens.map(token => ({
        value: token,
        label: token,
    })),
    // todo: update PAIR below to `USDC`, need to clarify with @BrunoCampos
    {
        value: '0xc46Ef6d2ca039Dde0B7448b40B24cf7234A19BEC' as `0x${string}`,
        label: 'HELLO',
    }, {
        value: '0x63A24Fb57De0D1Be65558c1dCaD332Eb356c6d11' as `0x${string}`,
        label: 'DUBAI',
    }], []);

    const handleSwapSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const amountA = tradeFormData.amount;
        const tokenB = tradeFormData.tokenB;
        const tokenA = tradeFormData.tokenA;

        try {
            const tokenADecimals = await getTokenDecimals(tokenA!);
            // const tokenBDecimals = await getTokenDecimals(tokenB!);
            const outputAmounts = await getAmountsOut(
                BigInt(
                    Math.floor(parseFloat(amountA!) * 10 ** tokenADecimals)
                ),
                [tokenA!, tokenB!]
            );

            if (!outputAmounts?.length || !tokenA || !tokenB) {
                toast.error('All fields in trade form are required');
            } else {
                try {
                    await giveAllowance(tokenA, outputAmounts[0]);
                    await giveAllowance(tokenB, outputAmounts[1]);
                    
                    const transaction_id = await handleSwap({
                        amountIn: outputAmounts[0],
                        amountOut: outputAmounts[1],
                        path: [tokenA, tokenB],
                        deadline: Date.now() + (tradeFormData.autoRevertsAfter ?? oneHourTimePeriod),
                    });
                    setTradeFormData({
                        amount: '',
                        tokenA: undefined,
                        tokenB: undefined,
                        autoRevertsAfter: oneHourTimePeriod,
                    });
    
                    toast.success(`Successfully trade ${amountA} tokens for ${tokenB}!`);
                    setTxResult(transaction_id);
                } catch (err) {
                    toast.error('Failed to swap tokens');
                    setTxError('Failed to swap tokens');
                }
            }
        } catch (err) {
            console.log('Error (swap)', err)
        }
    };

    const revertsInOptions = new Array(24).fill(null).map((hour, index) => ({
        label: `In ${index + 1} hour`,
        value: (hour + 1) * oneHourTimePeriod,
    }));

    return (
        <div className="flex-1 flex-col gap-4 w-6/12">
            <form
                onSubmit={handleSwapSubmit}
                className="bg-white rounded-lg p-10 border border-gray-300"
            >
                <h1 className="text-2xl font-bold mb-4">Trade Token via Uniswap Gateway</h1>
                <span className="text-sm text-gray-900">
                    Select a building token you hold and swap it to another building token or USDC
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
                <div className="mt-5">
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
                <div className="mt-5">
                    <label className="text-gray-500 text-md block mb-1 font-semibold" htmlFor="amount">
                        Amount of tokens to swap
                    </label>
                    <input
                        id="amount"
                        value={tradeFormData.amount}
                        onChange={(e) => setTradeFormData((prev) => ({
                            ...prev,
                            amount: e.target.value,
                        }))}
                        className="input input-bordered w-full text-sm"
                        placeholder="e.g. 0.00001"
                        required
                    />
                </div>
                <div className="mt-5 mb-5">
                    <label className="text-gray-500 text-md block mb-1 font-semibold" htmlFor="autoRevertsAfter">
                        Auto reverts period in hours
                    </label>
                    <Select
                        styles={colourStyles}
                        onChange={(value) => {
                            setTradeFormData(prev => ({
                                ...prev,
                                autoRevertsAfter: value?.value as unknown as number,
                            }))
                        }}
                        options={revertsInOptions}
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full"
                >
                    Swap tokens
                </button>
            </form>
            {txResult && <div className="flex mt-5">
                <p className="text-sm font-bold text-purple-600">
                    Deployed Tx Hash: {txResult}
                </p>
            </div>}
            {txError && <div className="flex mt-5">
                <p className="text-sm font-bold text-purple-600">
                    Deployed Tx Error: {txError}
                </p>
            </div>}
        </div>
    );
}
