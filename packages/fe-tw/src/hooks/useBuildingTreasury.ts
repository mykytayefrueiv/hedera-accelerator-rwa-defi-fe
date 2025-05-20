"use client";

import { toast } from "sonner";
import {
   depositToTreasury,
   getBusinessBalance,
   getTreasuryBalance,
   getTreasuryReserve,
   setTreasuryReserveAmount,
} from "@/services/treasuryService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useExecuteTransaction } from "./useExecuteTransaction";
import { useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
import { buildingTreasuryAbi } from "@/services/contracts/abi/buildingTreasuryAbi";
import { watchContractEvent } from "@/services/contracts/watchContractEvent"
import { ContractId } from "@hashgraph/sdk";
import { useEffect, useState } from "react";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { ExpenseRecord } from "@/consts/treasury";
import { utils } from "@/components/Expenses/ExpensesView";

export type PaymentRequestPayload = {
   receiver: string,
   amount: string
};

export function useBuildingTreasury(building?: `0x${string}`) {
   const queryClient = useQueryClient();
   const { executeTransaction } = useExecuteTransaction();
   const { writeContract } = useWriteContract();
   const [treasuryAddress, setTreasuryAddress] = useState<`0x${string}`>();
   const [paymentLogs, setPaymentLogs] = useState<any>();
   const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
   const [storedExpenses, setStoredExpenses] = useState<ExpenseRecord[]>([]);

   const { data, isLoading, isError } = useQuery({
      queryKey: ["treasuryData"],
      queryFn: async () => ({
         balance: getTreasuryBalance(),
         reserve: getTreasuryReserve(),
         businessBalance: getBusinessBalance(),
      }),
   });

   useEffect(() => {
      watchContractEvent({
         address: BUILDING_FACTORY_ADDRESS as `0x${string}`,
         abi: buildingFactoryAbi,
         eventName: "NewTreasury",
         onLogs: (data) => {
            const treasury = data.find(log => (log as unknown as { args: any[] }).args[1] === building);

            if (treasury) {
               setTreasuryAddress((treasury as unknown as { args: any[] }).args[0]);
            }
         },
      });
   }, [building]);

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
      if (storedExpenses?.length && paymentLogs?.length) {
         console.log('...!', paymentLogs, storedExpenses);

         const payments = paymentLogs
            .filter((payment: { args: any[] }) =>
               !!storedExpenses.find(exp => exp.receiver === payment.args[0] && exp.amount === payment.args[1])
            );

         console.log('payments...', payments);
         
         if (payments?.length) {
            setExpenses(payments);
         }
      }
   }, [storedExpenses, paymentLogs]);

   const depositMutation = useMutation({
      mutationFn: (amount: number) => depositToTreasury(amount),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["treasuryData"] });
      },
      onError: (err: Error) => {
         console.error("Error:", err.message);
      },
   });

   const paymentMutation = useMutation({
      mutationFn: async (payload: PaymentRequestPayload) => {
         const txAmount = ((parseFloat(payload.amount) * 10) ** 18);
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

   const reserveMutation = useMutation({
      mutationFn: (newReserve: number) => setTreasuryReserveAmount(newReserve),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["treasuryData"] });
      },
      onError: (err: Error) => {
         console.error("Error:", err.message);
      },
   });

   return {
      data,
      expenses,
      isLoading,
      isError,
      deposit: depositMutation.mutateAsync,
      makePayment: paymentMutation.mutateAsync,
      setReserve: reserveMutation.mutateAsync,
   };
}
