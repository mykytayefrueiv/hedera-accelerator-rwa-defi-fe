import { useOneSidedExchangeFactoryAbi } from "@/services/contracts/abi/oneSidedExchangeFactoryAbi";
import { ONE_SIDED_EXCHANGE_ADDRESS, UNISWAP_FACTORY_ADDRESS, USDC_ADDRESS } from "@/services/contracts/addresses";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { SwapTradeItem } from "@/types/erc3643/types";
import { DEFAULT_TOKEN_DECIMALS, useEvmAddress, useReadContract } from "@buidlerlabs/hashgraph-react-wallets";
import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { uniswapFactoryAbi } from "@/services/contracts/abi/uniswapFactoryAbi";
import { uniswapPairAbi } from "@/services/contracts/abi/uniswapPairAbi";
import { Log } from "@/types/queries";

const filterSwapHistoryItems = (swapItems: Log[], trader: `0x${string}`) => {
  return swapItems
    .filter((item) => item.args[0] === trader)
    .map((item) => ({
      tokenA: item.args[1],
      tokenB: item.args[2],
      tokenAAmount: ethers.formatUnits(item.args[3], DEFAULT_TOKEN_DECIMALS),
      tokenBAmount: ethers.formatUnits(item.args[4], DEFAULT_TOKEN_DECIMALS),
    }));
};

export const useSwapsHistory = (buildingTokens?: `0x${string}`[]) => {
    const [oneSidedExchangeSwapsHistory, setOneSidedExchangeSwapsHistory] = useState<SwapTradeItem[]>([]);
    const [uniswapExchangeHistory, setUniswapExchangeHistory] = useState<SwapTradeItem[]>([]);
    const [uniswapPairAddresses, setUniswapPairAddresses] = useState<`0x${string}`[]>([]);
    const [logs, setLogs] = useState<Log[]>([]);
    const { readContract } = useReadContract();

  const { data: evmAddress } = useEvmAddress();

    const readPairAddress = (tokenA: `0x${string}`, tokenB: `0x${string}`): Promise<`0x${string}`> => {
        return readContract({
            address: UNISWAP_FACTORY_ADDRESS,
            abi: uniswapFactoryAbi,
            functionName: "getPair",
            args: [tokenA, tokenB],
        }) as Promise<`0x${string}`>;
    };

    const watchPairSwaps = (pairAddress: `0x${string}`) => {
        watchContractEvent({
            address: pairAddress,
            abi: uniswapPairAbi,
            eventName: "Swap",
            onLogs: (data) => {
                setUniswapExchangeHistory(data.map((log: any) => ({
                    tokenA: log.args[0],
	                tokenB: log.args[5],
                    tokenAAmount: ethers.formatEther(log.args[2]).toString(),
                    tokenBAmount: ethers.formatEther(log.args[3]).toString(),
                    id: '',
                })))
            },
        });
    };

    const doReadPairs = useCallback(async () => {
        if (buildingTokens?.[0]) {
            try {
                const pairAddress = await readPairAddress(USDC_ADDRESS, buildingTokens?.[0]);

                setUniswapPairAddresses(prev => [...prev, pairAddress]);
            } catch (err) {
                // 
            }
        }
    }, []);

    useEffect(() => {
        doReadPairs();
    }, [doReadPairs]);
    
    useEffect(() => {
        if (uniswapPairAddresses[0]) {
            const nonZeroAddresses = uniswapPairAddresses.filter(pairAddress => pairAddress !== ethers.ZeroAddress);

            if (nonZeroAddresses[0]) {
                watchPairSwaps(nonZeroAddresses[0]);
            }
        }
    }, [uniswapPairAddresses]);

    useEffect(() => {
        if (logs.length) {
            setOneSidedExchangeSwapsHistory(prev => [...prev, ...filterSwapHistoryItems(logs, evmAddress)]);
        }
    }, [logs.length]);

  useEffect(() => {
    const unlisten = watchContractEvent({
      address: ONE_SIDED_EXCHANGE_ADDRESS as `0x${string}`,
      abi: useOneSidedExchangeFactoryAbi,
      eventName: "SwapSuccess",
      onLogs: (data) => {
        setLogs(data as unknown as Log[]);
      },
    });

    setTimeout(() => {
      unlisten();
    }, 10000);
  }, []);

    return { oneSidedExchangeSwapsHistory, uniswapExchangeHistory };
};
