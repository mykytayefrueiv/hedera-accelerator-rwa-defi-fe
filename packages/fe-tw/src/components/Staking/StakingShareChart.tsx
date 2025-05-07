"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import * as React from "react";
import { cx } from "class-variance-authority";

type StakingShareChartProps = {
   isLoading: boolean;
   totalStakedTokens: number | undefined;
   userStakedTokens: number | undefined;
   aTokenBalance: number | undefined;
};

const StakingShareChart = ({
   isLoading,
   totalStakedTokens,
   userStakedTokens,
   aTokenBalance,
}: StakingShareChartProps) => {
   const data = [
      { name: "Your Stake", value: userStakedTokens + aTokenBalance },
      { name: "Other Stakers", value: totalStakedTokens - userStakedTokens - aTokenBalance },
   ];

   const COLORS = ["#6b46c1", "#E5E5E5"];

   return (
      <Card>
         <CardHeader>
            <CardTitle>Your Staking Share</CardTitle>
            {!isLoading && totalStakedTokens === 0 && (
               <CardDescription>No tokens staked yet</CardDescription>
            )}
         </CardHeader>
         <CardContent
            className={cx("flex flex-col flex-auto", { "h-64": totalStakedTokens !== 0 })}
         >
            {isLoading ? (
               <span className="loading loading-spinner" />
            ) : (
               totalStakedTokens !== 0 && (
                  <ResponsiveContainer>
                     <PieChart>
                        <Pie
                           data={data}
                           dataKey="value"
                           nameKey="name"
                           cx="50%"
                           cy="50%"
                           innerRadius={60}
                           outerRadius={80}
                           paddingAngle={5}
                           isAnimationActive={true}
                           animationDuration={800}
                           animationBegin={0}
                        >
                           {data.map((entry, index) => (
                              <Cell
                                 key={`cell-${entry.name}`}
                                 fill={COLORS[index % COLORS.length]}
                              />
                           ))}
                        </Pie>
                        <Tooltip />
                     </PieChart>
                  </ResponsiveContainer>
               )
            )}

            {userStakedTokens !== 0 && (
               <div className="text-center mt-auto flex flex-col">
                  <p className="text-sm">
                     <span className="font-semibold">Classic stake:</span> {userStakedTokens}
                     &nbsp;tokens
                  </p>

                  <p className="text-sm">
                     <span className="font-semibold">Autocompound stake:</span> {aTokenBalance}
                     &nbsp;tokens
                  </p>

                  <p className="text-sm mt-1">
                     <span className="font-semibold">
                        Total Staked: {userStakedTokens + aTokenBalance}
                     </span>
                  </p>
               </div>
            )}
         </CardContent>
      </Card>
   );
};

export default StakingShareChart;
