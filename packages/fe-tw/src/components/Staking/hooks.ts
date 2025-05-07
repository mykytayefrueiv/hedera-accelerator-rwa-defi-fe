import { useBuildingDetails } from "@/hooks/useBuildingDetails";
import {
   useEvmAddress,
   useReadContract,
   useWriteContract,
} from "@buidlerlabs/hashgraph-react-wallets";
import { useMutation, useQuery } from "@tanstack/react-query";
import { readBuildingDetails } from "@/hooks/useBuildings";
import { buildingTreasuryAbi } from "@/services/contracts/abi/buildingTreasuryAbi";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { basicVaultAbi } from "@/services/contracts/abi/basicVaultAbi";
import { ContractId } from "@hashgraph/sdk";
import { TokenInfo, VaultInfo } from "@/components/Staking/types";
import { useExecuteTransaction } from "@/hooks/useExecuteTransaction";
import { useEffect } from "react";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { autoCompounderFactoryAbi } from "@/services/contracts/abi/autoCompounderFactoryAbi";
import { AUTO_COMPOUNDER_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { ethers } from "ethers";
import { find, isEmpty } from "lodash";
import { autoCompounderAbi } from "@/services/contracts/abi/autoCompounderAbi";

interface StakingHookReturnParams {
   loadingState: {
      isDepositing: boolean;
      isWithdrawing: boolean;
      isFetchingTokenInfo: boolean;
      isFetchingVaultInfo: boolean;
      isFetchingTreasuryAddress: boolean;
      isFetchingVaultAddress: boolean;
   };
   treasuryAddress: string | undefined;
   vaultAddress: string | undefined;
   tokenAddress: string | undefined;
   stakeTokens: (params: { amount: number }) => Promise<void>;
   unstakeTokens: (params: { amount: number }) => Promise<void>;
   userRewards?: number | undefined;
   tokenBalance: number | undefined;
   totalStakedTokens: number | undefined;
   userStakedTokens: number | undefined;
   rewardTokens: string[];
}

const getAutoCompounderAddress = async (vaultAddress: string) => {
   const provider = new ethers.BrowserProvider(window.ethereum);
   const signer = await provider.getSigner();

   const currentBlock = await provider.getBlockNumber();
   const fromBlock = Math.max(currentBlock - 10000, 0);

   const contract = new ethers.Contract(
      AUTO_COMPOUNDER_FACTORY_ADDRESS,
      autoCompounderFactoryAbi,
      provider,
   );

   const events = await contract.queryFilter("AutoCompounderDeployed", fromBlock, currentBlock);

   const autoCompounder = find(events, (log) => {
      const args = log.args as any;
      return args[1] === vaultAddress;
   });

   return isEmpty(autoCompounder) ? null : autoCompounder.args[0];
};

export const useStaking = ({
   buildingId,
}: {
   buildingId: `0x${string}`;
}): StakingHookReturnParams => {
   const { deployedBuildingTokens } = useBuildingDetails(buildingId);
   const { readContract } = useReadContract();
   const { writeContract } = useWriteContract();
   const { executeTransaction } = useExecuteTransaction();
   const { data: evmAddress } = useEvmAddress();
   const tokenAddress = deployedBuildingTokens[0]?.tokenAddress || "";

   const { data: treasuryAddress, isLoading: isFetchingTreasuryAddress } = useQuery({
      queryKey: ["BUILDING_DETAILS", buildingId],
      queryFn: () => readBuildingDetails(buildingId),
      select: (data) => data[0][5],
   });

   const { data: vaultAddress, isLoading: isFetchingVaultAddress } = useQuery({
      queryKey: ["VAULT_ADDRESS", treasuryAddress],
      queryFn: () =>
         readContract({
            address: treasuryAddress,
            abi: buildingTreasuryAbi,
            functionName: "vault",
         }),
      enabled: Boolean(treasuryAddress),
   });

   const { data: autoCompounderAddress, isLoading: isFetchingAutoCompounderAddress } = useQuery({
      queryKey: ["AUTO_COMPOUNDER_ADDRESS", vaultAddress],
      queryFn: () => getAutoCompounderAddress(vaultAddress as string),
      enabled: Boolean(vaultAddress),
   });

   console.log("autoCompounderAddress :>> ", autoCompounderAddress);

   const { data: tokenInfo, isLoading: isFetchingTokenInfo } = useQuery({
      queryKey: ["TOKEN_INFO", tokenAddress],
      queryFn: async (): Promise<TokenInfo | null> => {
         const [balance, decimals] = await Promise.all([
            readContract({
               address: tokenAddress,
               abi: tokenAbi,
               functionName: "balanceOf",
               args: [evmAddress],
            }),
            readContract({
               address: tokenAddress,
               abi: tokenAbi,
               functionName: "decimals",
            }),
         ]);

         const decimalValue = Number(decimals);
         return {
            tokenBalance: Number(balance) / 10 ** decimalValue,
            decimals: decimalValue,
         };
      },
      enabled: Boolean(tokenAddress) && Boolean(evmAddress),
   });

   const {
      data: vaultInfo,
      refetch: refetchVaultInfo,
      isLoading: isFetchingVaultInfo,
   } = useQuery({
      queryKey: ["VAULT_INFO", vaultAddress],
      queryFn: async (): Promise<VaultInfo | null> => {
         if (!vaultAddress || !evmAddress || !tokenInfo?.decimals) return null;

         const [totalAssets, myBalance, rewardTokens] = await Promise.all([
            readContract({
               address: vaultAddress,
               abi: basicVaultAbi,
               functionName: "totalAssets",
            }),
            readContract({
               address: vaultAddress,
               abi: basicVaultAbi,
               functionName: "balanceOf",
               args: [evmAddress],
            }),
            readContract({
               address: vaultAddress,
               abi: basicVaultAbi,
               functionName: "getRewardTokens",
            }),
         ]);

         return {
            totalStakedTokens: Number(totalAssets) / 10 ** tokenInfo.decimals,
            userStakedTokens: Number(myBalance) / 10 ** tokenInfo.decimals,
            rewardTokens,
         };
      },
      enabled: Boolean(vaultAddress) && Boolean(tokenInfo) && Boolean(evmAddress),
   });

   const { data: userRewards } = useQuery({
      queryKey: ["USER_REWARDS", vaultInfo?.rewardTokens[0], evmAddress],
      queryFn: () =>
         readContract({
            address: vaultAddress,
            abi: basicVaultAbi,
            functionName: "getUserReward",
            args: [evmAddress, vaultInfo?.rewardTokens[0]],
         }),
      enabled: Boolean(vaultInfo?.rewardTokens[0]) && Boolean(vaultAddress),
   });

   const { mutateAsync: stake, isPending: isDepositing } = useMutation({
      mutationFn: async ({ amount }: { amount: number }) => {
         const bigIntAmount = BigInt(
            Math.floor(Number.parseFloat(amount!) * 10 ** tokenInfo.decimals),
         );

         const approveTx = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, tokenAddress),
               abi: tokenAbi,
               functionName: "approve",
               args: [vaultAddress, bigIntAmount],
            }),
         );
         const depositTx = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, vaultAddress),
               abi: basicVaultAbi,
               functionName: "deposit",
               args: [bigIntAmount, evmAddress],
            }),
         );

         return { approveTx, depositTx };
      },
      onSuccess: refetchVaultInfo,
   });

   const { mutateAsync: stakeAutoCompound, isPending: isDepositingAutoCompounder } = useMutation({
      mutationFn: async ({ amount }: { amount: number }) => {
         const bigIntAmount = BigInt(
            Math.floor(Number.parseFloat(amount!) * 10 ** tokenInfo.decimals),
         );

         const approveTx = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, tokenAddress),
               abi: tokenAbi,
               functionName: "approve",
               args: [autoCompounderAddress, bigIntAmount],
            }),
         );
         const depositTx = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, autoCompounderAddress),
               abi: autoCompounderAbi,
               functionName: "deposit",
               args: [bigIntAmount, evmAddress],
            }),
         );

         return { approveTx, depositTx };
      },
      onSuccess: refetchVaultInfo,
   });

   const handleStake = async ({ amount, compoundRewards }) => {
      if (compoundRewards) {
         return stakeAutoCompound({ amount });
      }
      return stake({ amount });
   };

   const { mutateAsync: unstake, isPending: isWithdrawing } = useMutation({
      mutationFn: async ({ amount }: { amount: number }) => {
         const bigIntAmount = BigInt(
            Math.floor(Number.parseFloat(amount!) * 10 ** tokenInfo.decimals),
         );

         const withdrawTx = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, vaultAddress),
               abi: basicVaultAbi,
               functionName: "withdraw",
               args: [bigIntAmount, evmAddress, evmAddress],
            }),
         );

         return withdrawTx;
      },
      onSuccess: refetchVaultInfo,
   });

   const { data: aTokenInfo } = useQuery({
      queryKey: ["A_TOKENS", autoCompounderAddress, evmAddress],
      queryFn: async () => {
         const [balanceOfAToken, decimals] = await Promise.all([
            readContract({
               address: autoCompounderAddress,
               abi: autoCompounderAbi,
               functionName: "balanceOf",
               args: [evmAddress],
            }),
            readContract({
               address: autoCompounderAddress,
               abi: autoCompounderAbi,
               functionName: "decimals",
            }),
            // readContract({
            //    address: autoCompounderAddress,
            //    abi: autoCompounderAbi,
            //    functionName: "exchangeRate",
            // }),
         ]);

         const aTokenBalance = Number(ethers.formatUnits(balanceOfAToken, decimals));
         return { aTokenBalance, exchangeRate: 1 };
      },
      enabled: Boolean(autoCompounderAddress) && Boolean(evmAddress),
   });

   return {
      loadingState: {
         isDepositing: isDepositing || isDepositingAutoCompounder,
         isWithdrawing,
         isFetchingTokenInfo,
         isFetchingVaultInfo,
         isFetchingTreasuryAddress,
         isFetchingVaultAddress,
      },
      treasuryAddress,
      vaultAddress: vaultAddress as string,
      tokenAddress,
      stakeTokens: handleStake,
      unstakeTokens: ({ amount }) => unstake({ amount }),
      userRewards: userRewards as number,
      aTokenBalance: aTokenInfo?.aTokenBalance,
      ...vaultInfo,
      ...tokenInfo,
   };
};
