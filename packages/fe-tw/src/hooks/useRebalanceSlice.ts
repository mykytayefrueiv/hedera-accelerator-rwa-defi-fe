"use client";

import { ContractId } from "@hashgraph/sdk";
import { useMutation } from "@tanstack/react-query";
import { useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";
import { sliceAbi } from "@/services/contracts/abi/sliceAbi";
import { toast } from "sonner";

export function useRebalanceSlice(sliceAddress: `0x${string}`) {
   const { executeTransaction } = useExecuteTransaction();
   const { writeContract } = useWriteContract();

   const rebalanceMutation = useMutation({
      mutationFn: async () => {
         const tx = await executeTransaction(() => writeContract({
            functionName: 'rebalance',
            args: [],
            abi: sliceAbi,
            contractId: ContractId.fromEvmAddress(0, 0, sliceAddress),
         })) as { transaction_id: string };
         
         return tx?.transaction_id;
      },
      onSuccess: () => {
         toast.success("Rebalance success");
      },
      onError: () => {
         toast.error("Rebalance error");
      },
   });

   return { rebalanceMutation };
}
