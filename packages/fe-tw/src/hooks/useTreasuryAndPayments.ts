"use client";

import { treasuryAbi } from "@/services/contracts/abi/treasuryAbi";
import { useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";

type MakePaymentPayload = {
    sendTo: `0x${string}`,
    amount: bigint,
};

export const useTreasuryAndPayments = (treasuryAddress: `0x${string}`) => {
    const { writeContract } = useWriteContract();

    const makePayment = async (data: MakePaymentPayload) => {
        const result = (await writeContract({
            contractId: ContractId.fromSolidityAddress(treasuryAddress),
            abi: treasuryAbi,
            functionName: "makePayment",
            args: [data.sendTo, data.amount],
        }));

        return result;
    }

    return { makePayment };
}
