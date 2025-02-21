"use client";

import TradeFormOneSidedExchange from "@/components/Trade/TradeFormOneSidedExchange";
import TradeFormUniswapPool from "@/components/Trade/TradeFormUniswapPool";
import TradePortfolio from "@/components/Trade/TradePortfolio";
import { useBuildingDetails } from "@/hooks/useBuildingDetails";
import { useSwapsHistory } from "@/hooks/useSwapsHistory";
import { BuildingData } from "@/types/erc3643/types";
import { useState } from "react";

type Props = {
  building: BuildingData;
}

// todo: replace with real data and logic
const tradeProfitDataMock = {
  dailyProfitInUSD: 100,
  weeklyProfitInUSD: 1000,
};

type SwapType = 'uniswap' | 'one_sided';

export default function TradeView({ building }: Props) {
  const { oneSidedExchangeSwapsHistory } = useSwapsHistory();
  const [swapTypeForm, setSwapTypeForm] = useState<SwapType>('uniswap');
  const { deployedBuildingTokens } = useBuildingDetails(building.address as `0x${string}`);

  const buildingTokens = deployedBuildingTokens.map(tok => tok.tokenAddress);

  return (
    <div className="mt-8 flex flex-wrap flex-row gap-8 w-full">
      <div>
        ...
      </div>
      {swapTypeForm === 'uniswap' ? <TradeFormUniswapPool buildingTokens={buildingTokens} /> : <TradeFormOneSidedExchange buildingTokens={buildingTokens} />}
      {swapTypeForm === 'uniswap' ? <></> : <TradePortfolio tradeHistory={oneSidedExchangeSwapsHistory} tradeProfitData={tradeProfitDataMock} />}
    </div>
  );
}
