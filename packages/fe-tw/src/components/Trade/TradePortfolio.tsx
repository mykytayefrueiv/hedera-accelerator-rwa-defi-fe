"use client";

import { SwapTradeItem } from "@/types/erc3643/types";

interface Props {
  tradeHistory: SwapTradeItem[],
}

const TradePortfolioItem = (props: SwapTradeItem) => {
  return (
    <div className="bg-gray-100 rounded-lg p-6 w-full">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">
            Token A address: <span className="font-bold">{props.tokenA}</span>
          </p>
          <p className="text-sm text-green-500">
            Token A amount: <span className="font-bold">{props.tokenAAmount?.toString()}</span>
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">
            Token B address: <span className="font-bold">{props.tokenB}</span>
          </p>
          <p className="text-sm text-green-500">
            Token B amount: <span className="font-bold">{props.tokenBAmount?.toString()}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default function TradePortfolio({ tradeHistory }: Props) {
  return (
    <>
      <div className="bg-white rounded-lg p-10 border border-gray-300 w-6/12">
        <h1 className="text-2xl font-bold mb-4">Trade Portfolio</h1>
        <div className="bg-gray-100 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Profit today</p>
              <p className="text-green-500">+$4,245.45</p>
            </div>
          </div>
        </div>
        {tradeHistory?.length && (
          <>
            <h1 className="text-2xl font-bold mb-4 mt-6">Trade History</h1>
            <div className="flex flex-col gap-2">
              {tradeHistory.map((tradeItem, id) => (
                <TradePortfolioItem key={id} {...tradeItem} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
