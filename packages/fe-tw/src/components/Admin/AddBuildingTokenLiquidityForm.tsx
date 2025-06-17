"use client";

import { useBuildingLiquidity } from "@/hooks/useBuildingLiquidity";
import { useBuildings } from "@/hooks/useBuildings";
import { Form, Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Droplets, Power } from "lucide-react";
import { USDC_ADDRESS } from "@/services/contracts/addresses";
import { useBuildingInfo } from "@/hooks/useBuildingInfo";
import { useTokenInfo } from "@/hooks/useTokenInfo";
import { TxResultToastView } from "../CommonViews/TxResultView";
import { ethers } from "ethers";
import { useReadContract, useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
import { uniswapFactoryAbi } from "@/services/contracts/abi/uniswapFactoryAbi";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { ContractId } from "@hashgraph/sdk";
import { buildingAbi } from "@/services/contracts/abi/buildingAbi";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { find } from "lodash";

type Props = {
   buildingAddress?: `0x${string}`;
};

export function AddBuildingTokenLiquidityForm({ buildingAddress }: Props) {
   const { buildings } = useBuildings();
   const { isAddingLiquidity, txHash, txError, addLiquidity } = useBuildingLiquidity();
   const [tokensToLiquidity, setTokensToLiquidity] = useState<string[]>([]);
   const { readContract } = useReadContract();
   const [pairAddress, setPairAddress] = useState<string | null>(ethers.ZeroAddress);
   const { tokenAddress } = useBuildingInfo(buildingAddress);

   useEffect(() => {
      (async () => {
         const factoryAddress = await readContract({
            address: buildingAddress,
            abi: buildingAbi,
            functionName: "getUniswapFactory",
         });

         const pairAddress = await readContract({
            address: factoryAddress,
            abi: uniswapFactoryAbi,
            functionName: "getPair",
            args: [tokenAddress, USDC_ADDRESS],
         });
         setPairAddress(pairAddress);
      })();
   }, [buildingAddress, tokenAddress, readContract]);

   const { name: tokenName } = useTokenInfo(tokenAddress);
   const { writeContract } = useWriteContract();

   useEffect(() => {
      if (txHash) {
         toast.success(
            <TxResultToastView title="Liquidity added successfully!" txSuccess={txHash} />,
         );
      }
      if (txError) {
         toast.error(<TxResultToastView title="Error adding liquidity" txError={txError} />, {
            duration: Infinity,
         });
      }
   }, [txHash, txError]);

   async function handleSubmit(
      values: {
         buildingAddress: string;
         tokenBAddress: string;
         tokenAAddress: string;
         tokenAAmount: string;
         tokenBAmount: string;
      },
      actions: { resetForm: () => void },
   ) {
      const {
         buildingAddress: buildingAddressValue,
         tokenAAddress,
         tokenBAddress,
         tokenAAmount,
         tokenBAmount,
      } = values;
      const buildingAddressOneOf = buildingAddress || buildingAddressValue;

      if (
         !buildingAddressOneOf ||
         !tokenAAddress ||
         !tokenBAddress ||
         !tokenAAmount ||
         !tokenBAmount
      ) {
         toast.error("All fields are required.");
         return;
      }

      setTokensToLiquidity([tokenAAddress, tokenBAddress]);
      await addLiquidity({
         buildingAddress: buildingAddressOneOf,
         tokenAAddress,
         tokenBAddress,
         tokenAAmount,
         tokenBAmount,
      });

      actions.resetForm();
   }

   const tokenSelectOptions = useMemo(
      () => [
         {
            value: tokenAddress,
            label: `${tokenName} (${tokenAddress})`,
         },
         {
            value: USDC_ADDRESS,
            label: `USDC (${USDC_ADDRESS})`,
         },
      ],
      [tokenAddress, tokenName],
   );

   const waitForPairCreation = async (tokenAddress: string, factoryAddress: string) => {
      return new Promise<void>((resolve, reject) => {
         watchContractEvent({
            address: factoryAddress,
            abi: uniswapFactoryAbi,
            eventName: "PairCreated",
            onLogs: (logs) => {
               const newPair = find(logs, (log) => {
                  const [token0, token1] = log.args;
                  return (
                     (token0.toLowerCase() === tokenAddress.toLowerCase() &&
                        token1.toLowerCase() === USDC_ADDRESS.toLowerCase()) ||
                     (token1.toLowerCase() === tokenAddress.toLowerCase() &&
                        token0.toLowerCase() === USDC_ADDRESS.toLowerCase())
                  );
               });
               if (newPair) {
                  resolve(newPair.args[2]);
               }
            },
         });
      });
   };

   const handleInitPool = async () => {
      try {
         const factoryAddress = await readContract({
            address: buildingAddress,
            abi: buildingAbi,
            functionName: "getUniswapFactory",
         });

         const createPairTx = await writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, factoryAddress),
            abi: uniswapFactoryAbi,
            functionName: "createPair",
            args: [tokenAddress, USDC_ADDRESS],
         });

         const createdPairAddress = await waitForPairCreation(tokenAddress, factoryAddress);

         const identityTx = await writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
            abi: buildingFactoryAbi,
            functionName: "deployIdentityForWallet",
            args: [createdPairAddress],
         });

         const countryCode = 840;
         await writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, BUILDING_FACTORY_ADDRESS),
            abi: buildingFactoryAbi,
            functionName: "registerIdentity",
            args: [buildingAddress, createdPairAddress, countryCode],
         });

         toast.success("Pool initialized successfully!");
      } catch (error) {
         console.error("Error initializing pool:", error);
         toast.error("Failed to initialize pool");
      }
   };

   return (
      <div className="bg-white rounded-xl shadow-lg border border-indigo-100 w-full max-w-2xl">
         <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-xl border-b border-indigo-100 p-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
               <Droplets className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
               <h3 className="text-xl font-semibold text-indigo-900">
                  Add Liquidity for Building Tokens
               </h3>
               <p className="text-sm text-indigo-700/70">
                  Provide liquidity to enable token trading
               </p>
            </div>

            <Button
               disabled={pairAddress === ethers.ZeroAddress}
               className="ml-auto"
               onClick={handleInitPool}
            >
               <Power className="w-4 h-4" />
               Init
            </Button>
         </div>

         <div className="p-6">
            <Formik
               initialValues={{
                  buildingAddress: "",
                  tokenAAddress: "",
                  tokenBAddress: USDC_ADDRESS,
                  tokenAAmount: "",
                  tokenBAmount: "",
               }}
               onSubmit={handleSubmit}
            >
               {({ setFieldValue, getFieldProps, values }) => (
                  <Form className="space-y-4">
                     {!buildingAddress && (
                        <div>
                           <Label htmlFor="buildingAddress">Choose a Building</Label>
                           <Select
                              name="buildingAddress"
                              onValueChange={(value) => setFieldValue("buildingAddress", value)}
                              value={values.buildingAddress}
                           >
                              <SelectTrigger className="w-full mt-1">
                                 <SelectValue placeholder="Choose a Building" />
                              </SelectTrigger>
                              <SelectContent>
                                 {buildings?.map((building) => (
                                    <SelectItem
                                       key={building.address}
                                       value={building.address as `0x${string}`}
                                    >
                                       {building.title} ({building.address})
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        </div>
                     )}
                     <div>
                        <Label htmlFor="tokenAAddress">Select Token A</Label>

                        <Select
                           name="tokenAAddress"
                           onValueChange={(value) => setFieldValue("tokenAAddress", value)}
                           value={values.tokenAAddress}
                        >
                           <SelectTrigger className="w-full mt-1">
                              <SelectValue placeholder="Choose a Token" />
                           </SelectTrigger>
                           <SelectContent>
                              {tokenSelectOptions.map((token) => (
                                 <SelectItem key={token.value} value={token.value}>
                                    {token.label}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                     <div>
                        <Label htmlFor="tokenAAmount">Token A Amount</Label>
                        <Input
                           className="mt-1"
                           placeholder="e.g. 100"
                           {...getFieldProps("tokenAAmount")}
                        />
                     </div>

                     {/* Token B */}
                     <div>
                        <Label htmlFor="tokenBAddress">Select Token B</Label>

                        <Select
                           name="tokenBAddress"
                           onValueChange={(value) => setFieldValue("tokenBAddress", value)}
                           value={values.tokenBAddress}
                           disabled
                        >
                           <SelectTrigger className="w-full mt-1">
                              <SelectValue placeholder="Choose a Token" />
                           </SelectTrigger>
                           <SelectContent>
                              {tokenSelectOptions.map((token) => (
                                 <SelectItem key={token.value} value={token.value}>
                                    {token.label}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>

                     <div>
                        <Label htmlFor="tokenBAmount">Token B Amount</Label>
                        <Input
                           className="mt-1"
                           placeholder="e.g. 100"
                           {...getFieldProps("tokenBAmount")}
                        />
                     </div>

                     <div className="flex justify-end gap-5 mt-5">
                        <Button
                           type="submit"
                           disabled={isAddingLiquidity}
                           isLoading={isAddingLiquidity}
                        >
                           {isAddingLiquidity ? "Liquidity in progress..." : "Add Liquidity"}
                        </Button>
                     </div>
                  </Form>
               )}
            </Formik>
         </div>
      </div>
   );
}
