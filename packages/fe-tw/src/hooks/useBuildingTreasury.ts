"use client";

import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useExecuteTransaction } from "./useExecuteTransaction";
import { useWriteContract, useReadContract } from "@buidlerlabs/hashgraph-react-wallets";
import { buildingTreasuryAbi } from "@/services/contracts/abi/buildingTreasuryAbi";
import { watchContractEvent } from "@/services/contracts/watchContractEvent"
import { ContractId } from "@hashgraph/sdk";
import { useEffect, useState } from "react";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { ExpenseRecord } from "@/consts/treasury";
import { PaymentRequestPayload } from "@/types/erc3643/types";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { ethers } from "ethers";
import { StorageKeys, storageService } from "@/services/storageService";

export function useBuildingTreasury(buildingAddress?: `0x${string}`) {
   const queryClient = useQueryClient();
   const { executeTransaction } = useExecuteTransaction();
   const { writeContract } = useWriteContract();
   const { readContract } = useReadContract();
   const [treasuryAddress, setTreasuryAddress] = useState<`0x${string}`>();
   const [paymentLogs, setPaymentLogs] = useState<any>();
   const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);

   const { data: treasuryData, isLoading, isError } = useQuery({
      queryKey: ["treasuryData", treasuryAddress],
      queryFn: async () => {
         if (!treasuryAddress) return null;

         const treasuryUsdcAddress = await readContract({
            address: treasuryAddress,
            abi: buildingTreasuryAbi,
            functionName: "usdc",
         });
   
         if (!treasuryUsdcAddress) return null;
   
         const [balance, decimals] = await Promise.all([
            readContract({
               address: treasuryUsdcAddress as `0x${string}`,
               abi: tokenAbi,
               functionName: "balanceOf",
               args: [treasuryAddress],
            }),
            readContract({
               address: treasuryUsdcAddress as `0x${string}`,
               abi: tokenAbi,
               functionName: "decimals",
            }),
         ]);
   
         return {
            balance: Number(ethers.formatUnits(balance as bigint, decimals as bigint)),
            usdcAddress: treasuryUsdcAddress,
            decimals,
         };
      },
      enabled: Boolean(treasuryAddress),
   });

   useEffect(() => {
      watchContractEvent({
         address: BUILDING_FACTORY_ADDRESS as `0x${string}`,
         abi: buildingFactoryAbi,
         eventName: "NewTreasury",
         onLogs: (data) => {
            const treasury = data.find(log => (log as unknown as { args: any[] }).args[1] === buildingAddress);

            if (treasury) {
               setTreasuryAddress((treasury as unknown as { args: any[] }).args[0]);
            }
         },
      });
   }, [buildingAddress]);

   useEffect(() => {
      if (treasuryAddress) {
         watchContractEvent({
            address: treasuryAddress!,
            abi: buildingTreasuryAbi,
            eventName: "Payment",
            onLogs: (data) => {
               setPaymentLogs(data);
            },
        });
      }
   }, [treasuryAddress]);

   useEffect(() => {
      storageService.restoreItem<ExpenseRecord[]>(StorageKeys.Expenses).then(data => {
         if (data?.length && paymentLogs?.length) {
            const expensePayments = data
               .filter(expense =>
                  !!paymentLogs.find(
                     (payment: { args: any[] }) =>
                        expense.receiver === payment.args[0] &&
                        expense.amount === ethers.formatUnits(payment.args[1].toString(), 6)
                  )
               );
            
            if (expensePayments?.length) {
               setExpenses(expensePayments);
            }
         }
      });
   }, [paymentLogs]);

   const paymentMutation = useMutation({
      mutationFn: async (payload: PaymentRequestPayload) => {
         const txAmount = ethers.parseUnits(parseFloat(payload.amount).toString(), treasuryData?.decimals as string);

         const tx = await executeTransaction(() => writeContract({
            functionName: 'makePayment',
            args: [payload.receiver, txAmount],
            abi: buildingTreasuryAbi,
            contractId: ContractId.fromEvmAddress(0, 0, treasuryAddress!),
         })) as { transaction_id: string };

         return tx;
      },
      onSuccess: (tx) => {
         toast.success(`Payment submitted successfully ${tx?.transaction_id}`);
         queryClient.invalidateQueries({ queryKey: ["treasuryData"] });
      },
      onError: (err: Error) => {
         toast.error(`Payment submitted error ${err.message}`);
      },
   });

   /** 
      const depositMutation = useMutation({
         mutationFn: (amount: number) => depositToTreasury(amount),
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["treasuryData"] });
         },
         onError: (err: Error) => {
            console.error("Error:", err.message);
         },
      });

      const reserveMutation = useMutation({
         mutationFn: (newReserve: number) => setTreasuryReserveAmount(newReserve),
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["treasuryData"] });
         },
         onError: (err: Error) => {
            console.error("Error:", err.message);
         },
      });
   **/

   return {
      treasuryData,
      expenses,
      isLoading,
      isError,
      makePayment: paymentMutation.mutateAsync,
   };
}
