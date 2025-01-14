"use client";

interface TradePortfolioProps {
  usdcBalance: number;
  usdcChangePercentage: number;
  tokenBalance: number;
  tokenUsdValue: number;
  tokenChangePercentage: number;
}

export default function TradePortfolio({
  usdcBalance,
  usdcChangePercentage,
  tokenBalance,
  tokenUsdValue,
  tokenChangePercentage,
}: TradePortfolioProps) {
  return (
    <div className="flex-1 bg-white">
      <h2 className="text-xl font-semibold mb-4">Your Portfolio</h2>

      {/* USDC Holdings */}
      <div className="bg-gray-100 rounded-lg p-6 mb-4 transition-transform duration-300 hover:scale-[1.02] hover:bg-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Balance</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-3xl font-bold text-gray-800">${usdcBalance.toLocaleString()}</p>
            <p className="text-green-500 mt-1">+{usdcChangePercentage}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Profit today</p>
            <p className="text-green-500">+$4,245.45</p>
          </div>
        </div>
      </div>

      {/* Token Holdings */}
      <div className="bg-gray-100 rounded-lg p-6 transition-transform duration-300 hover:scale-[1.02] hover:bg-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Token Holdings</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-3xl font-bold text-gray-800">{tokenBalance} Tokens</p>
            <p className="text-gray-500 mt-1">${tokenUsdValue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Profit today</p>
            <p className="text-green-500">+{tokenChangePercentage}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
