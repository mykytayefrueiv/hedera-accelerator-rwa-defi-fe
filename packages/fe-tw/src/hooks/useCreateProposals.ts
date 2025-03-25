import { buildingGovernanceAbi } from "@/services/contracts/abi/buildingGovernanceAbi";
import { useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";
import { toast } from "react-hot-toast";

export const useCreateProposals = (governanceAddress: `0x${string}`) => {
    const { writeContract } = useWriteContract();

    const createTextProposal = async (text: string) => {
        const tx = (await writeContract({
            contractId: ContractId.fromSolidityAddress(governanceAddress),
            abi: buildingGovernanceAbi,
            functionName: "createTextProposal",
            args: ["GovernorVote", text],
        }));

        toast.success("Text proposal successfully created");

        return tx;
    };

    const createPaymentProposal = async (amount: number, proposalTo: `0x${string}`, text: string) => {
        const tx = (await writeContract({
            contractId: ContractId.fromSolidityAddress(governanceAddress),
            abi: buildingGovernanceAbi,
            functionName: "createPaymentProposal",
            args: [amount, proposalTo, text],
        }));

        toast.success("Payment proposal successfully created");

        return tx;
    };

    return { createPaymentProposal, createTextProposal };
};
