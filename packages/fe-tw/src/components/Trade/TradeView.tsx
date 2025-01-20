"use client";

import TradeForm from "@/components/Trade/TradeForm";
import TradePortfolio from "@/components/Trade/TradePortfolio";
import ProfitGraph from "@/components/Trade/ProfitGraph";

export default function TradeView() {
  const usdcBalance = 1180577.24;
  const usdcChangePercentage = 14.5;
  const tokenBalance = 108.61;
  const tokenUsdValue = tokenBalance * 19509.23;
  const tokenChangePercentage = 5;

  const profitDataDaily = [
    { time: "04:00", profit: 1000 },
    { time: "09:00", profit: 2000 },
    { time: "14:00", profit: 1500 },
    { time: "19:00", profit: 2500 },
    { time: "00:00", profit: 3000 },
  ];

  const profitDataWeekly = [
    { time: "Mon", profit: 5000 },
    { time: "Tue", profit: 7000 },
    { time: "Wed", profit: 6500 },
    { time: "Thu", profit: 8000 },
    { time: "Fri", profit: 7500 },
  ];

  const profitDataMonthly = [
    { time: "Week 1", profit: 15000 },
    { time: "Week 2", profit: 18000 },
    { time: "Week 3", profit: 17000 },
    { time: "Week 4", profit: 20000 },
  ];

  const profitDataYearly = [
    { time: "Jan", profit: 50000 },
    { time: "Feb", profit: 52000 },
    { time: "Mar", profit: 55000 },
    { time: "Apr", profit: 60000 },
    { time: "May", profit: 62000 },
  ];

  return (
    <div className="mt-8 flex flex-col gap-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/** <TradePortfolio
          usdcBalance={usdcBalance}
          usdcChangePercentage={usdcChangePercentage}
          tokenBalance={tokenBalance}
          tokenUsdValue={tokenUsdValue}
          tokenChangePercentage={tokenChangePercentage}
        /> **/}
        <TradeForm />
      </div>
      {/** <ProfitGraph
        profitDataDaily={profitDataDaily}
        profitDataWeekly={profitDataWeekly}
        profitDataMonthly={profitDataMonthly}
        profitDataYearly={profitDataYearly}
      /> **/}
    </div>
  );
}
