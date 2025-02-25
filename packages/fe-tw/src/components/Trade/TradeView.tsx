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

type TradeFormTypeTabsProps = {
  swapTypeForm: SwapType,
  onSwapTabChange: (newType: SwapType) => void,
};

const TradeFormTypeTabs = ({ swapTypeForm, onSwapTabChange }: TradeFormTypeTabsProps) => {
  return (
    <div role="tablist" className="tabs tabs-boxed lg:w-6/12">
      <a
        role="tab"
        className={`tab${swapTypeForm === 'uniswap' ? ' tab-active' : ''}`}
        onClick={() => onSwapTabChange('uniswap')}
      >Uniswap Trade</a>
      <a
        role="tab"
        className={`tab${swapTypeForm === 'one_sided' ? ' tab-active' : ''}`}
        onClick={() => onSwapTabChange('one_sided')}
      >One Sided Trade</a>
    </div>
  );
};

export default function TradeView({ building }: Props) {
  const { oneSidedExchangeSwapsHistory, uniswapExchangeHistory } = useSwapsHistory();
  const [swapTypeForm, setSwapTypeForm] = useState<SwapType>('uniswap');
  const { deployedBuildingTokens } = useBuildingDetails(building.address as `0x${string}`);

  const buildingTokens = deployedBuildingTokens.map(tok => tok.tokenAddress);

  return (
    <div className="mt-8 flex flex-col gap-8">
      <TradeFormTypeTabs swapTypeForm={swapTypeForm} onSwapTabChange={(swapType) => setSwapTypeForm(swapType)} />
      <div className="mt-8 flex flex-wrap flex-row gap-8 w-full">
        {swapTypeForm === 'uniswap' ? <TradeFormUniswapPool buildingTokens={buildingTokens} /> : <TradeFormOneSidedExchange buildingTokens={buildingTokens} />}
        <TradePortfolio tradeHistory={swapTypeForm === 'uniswap' ? uniswapExchangeHistory : oneSidedExchangeSwapsHistory} tradeProfitData={tradeProfitDataMock} />
      </div>
    </div>
  );
}
