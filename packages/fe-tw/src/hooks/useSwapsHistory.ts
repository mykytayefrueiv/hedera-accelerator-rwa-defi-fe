import { oneSidedExchangeAbi } from "@/services/contracts/abi/oneSidedExchangeAbi";
import { oneSidedExchangeAddress } from "@/services/contracts/addresses";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { QueryData, SwapTradeItem } from "@/types/erc3643/types";
import { DEFAULT_TOKEN_DECIMALS, useEvmAddress } from "@buidlerlabs/hashgraph-react-wallets";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

type Log = QueryData<string[]>;

const filterSwapHistoryItems = (swapItems: Log[], trader: `0x${string}`) => {
    return swapItems.filter(item => item.args[0] === trader).map(item => ({
        tokenA: item.args[1],
        tokenB: item.args[2],
        tokenAAmount: ethers.formatUnits(item.args[3], DEFAULT_TOKEN_DECIMALS),
        tokenBAmount: ethers.formatUnits(item.args[4], DEFAULT_TOKEN_DECIMALS),
    }));
};

export const useSwapsHistory = () => {
    const [oneSidedExchangeSwapsHistory, setOneSidedExchangeSwapsHistory] = useState<SwapTradeItem[]>([]);
    const [logs, setLogs] = useState<Log[]>([]);

    const { data: evmAddress } = useEvmAddress();

    useEffect(() => {
        if (logs.length) {
            setOneSidedExchangeSwapsHistory(prev => [...prev, ...filterSwapHistoryItems(logs, evmAddress)]);
        }
    }, [logs.length]);

    useEffect(() => {
        const unlisten = watchContractEvent({
            address: oneSidedExchangeAddress as `0x${string}`,
            abi: oneSidedExchangeAbi,
            eventName: "SwapSuccess",
            onLogs: (data) => {
                setLogs(data as unknown as Log[]);
            },
        });

        setTimeout(() => {
            unlisten();
        }, 10000);
    }, []);

    return { oneSidedExchangeSwapsHistory };
};
