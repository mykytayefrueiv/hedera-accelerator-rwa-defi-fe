import { sliceAbi } from "@/services/contracts/abi/sliceAbi";
import { sliceFactoryAbi } from "@/services/contracts/abi/sliceFactoryAbi";
import { UNISWAP_ROUTER_ADDRESS, USDC_ADDRESS, SLICE_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import type { CreateSliceRequestData } from "@/types/erc3643/types";
import { pinata } from "@/utils/pinata";
import { useWatchTransactionReceipt, useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";
import { useMutation } from "@tanstack/react-query";
import * as uuid from "uuid";
import { toast } from "sonner";
import { useExecuteTransaction } from "./useExecuteTransaction";
import { parseUnits } from "ethers";

const CHAINLINK_PRICE_ID = "0x269501f5674BeE3E8fef90669d3faa17021344d0";

const calculateTokenAssetAllocations = (
   tokenAssets: string[],
   tokenAssetsPercentages: { [key: string]: string },
   tokenAssetsTotalAmount: string
) => {
   const tokenAssetAmounts: { [key: string]: string } = {};
   const totalTokensAmountParsed = parseFloat(tokenAssetsTotalAmount);

   tokenAssets.forEach((asset) => {
      tokenAssetAmounts[asset] = ((totalTokensAmountParsed / 100) * parseFloat(tokenAssetsPercentages[asset])).toString();
   });

   return tokenAssetAmounts;
};

export function useCreateSlice(deployedSlice?: `0x${string}`) {
   const { writeContract } = useWriteContract();
   const { watch } = useWatchTransactionReceipt();
   const { executeTransaction } = useExecuteTransaction();

   const allocations = async (
      assets: string[],
      percentages: { [key: string]: string },
      assetId: number,
      txResults: string[],
      sliceAddress?: `0x${string}`,
   ) => {
      if (assets[assetId]) {
         const result = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, sliceAddress || deployedSlice!),
               abi: sliceAbi,
               functionName: "addAllocation",
               args: [assets[assetId], CHAINLINK_PRICE_ID, percentages[assets[assetId]]],
            }),
         );;

         return allocations(assets, percentages, assetId + 1, [
            ...txResults, (result as { transaction_id: string }).transaction_id,
         ], sliceAddress);
      }

      return txResults;
   };

   const approvals = async (
      underlyingAssets: string[],
      assets: string[],
      amounts: { [key: string]: string },
      assetId: number,
      txResults: string[],
      sliceAddress?: `0x${string}`,
   ) => {
      if (assets[assetId]) {
         const result = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, assets[assetId]),
               abi: sliceAbi,
               functionName: "approve",
               args: [sliceAddress || deployedSlice!, parseUnits(amounts[assets[assetId]], 18)],
            }),
         );

         return approvals(underlyingAssets, assets, amounts, assetId + 1, [
            ...txResults, (result as { transaction_id: string }).transaction_id,
         ], sliceAddress);
      }

      return txResults;
   };

   const deposits = async (
      assets: string[],
      amounts: { [key: string]: string },
      assetId: number,
      txResults: string[],
      sliceAddress?: `0x${string}`,
   ) => {
      if (assets[assetId]) {
         const result = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, sliceAddress || deployedSlice!),
               abi: sliceAbi,
               functionName: "deposit",
               args: [assets[assetId], parseUnits(amounts[assets[assetId]], 18)],
            }),
         );

         return deposits(assets, amounts, assetId + 1, [
            ...txResults, (result as { transaction_id: string }).transaction_id,
         ], sliceAddress);
      }

      return txResults;
   };
   
   const addSliceTokenAssets = async (values: CreateSliceRequestData): Promise<string[][] | undefined> => {
      const { sliceAllocation, deployedSliceAddress } = values;
      const { tokenAssets, tokenAssetAmounts: tokenAssetAllocationPercentages, totalAssetsAmount } = sliceAllocation;
      const tokenAllocationAmounts = calculateTokenAssetAllocations(tokenAssets, tokenAssetAllocationPercentages, totalAssetsAmount);
      const approvalsHashes = await approvals(values.underlyingAssets!, tokenAssets, tokenAllocationAmounts, 0, [], deployedSliceAddress);
      const allocationHashes = await allocations(tokenAssets, tokenAssetAllocationPercentages, 0, [], deployedSliceAddress);
      const depositsHashes = await deposits(tokenAssets, tokenAllocationAmounts, 0, [], deployedSliceAddress);

      return [allocationHashes, depositsHashes, approvalsHashes];
   };

   const rebalanceSliceMutation = useMutation({
      mutationFn: async (values: CreateSliceRequestData) => {
         // todo: `approve` and `addReward` for vaults
         const tx = await executeTransaction(() => writeContract({
            functionName: 'rebalance',
            args: [],
            abi: sliceAbi,
            contractId: ContractId.fromEvmAddress(0, 0, values.deployedSliceAddress || deployedSlice!),
         })) as { transaction_id: string };
         
         return tx?.transaction_id;
      },
      onSuccess: () => {
         toast.success("Perform rebalance success");
      },
      onError: () => {
         toast.error("Perform rebalance error");
      },
   });

   const addSliceTokenAssetsMutation = useMutation({
      mutationFn: async (values: CreateSliceRequestData) => {
         const hashes = await addSliceTokenAssets(values);

         return hashes;
      },
      onSuccess: (txs) => {
         toast.success(`Perform deposits and allocations batch success ${txs?.map(txs => `${txs}, `)}`);
      },
      onError: () => {
         toast.error("Perform deposits and allocations batch error");
      },
   });

   const waitForLastSliceDeployed = (): Promise<`0x${string}` | undefined> => {
      return new Promise((res) => {
         let logs: any = [];

         const unsubscribe = watchContractEvent({
            address: SLICE_FACTORY_ADDRESS,
            abi: sliceFactoryAbi,
            eventName: "SliceDeployed",
            onLogs: (data: any) => {
               logs = [...logs, ...data];
            },
         });

         setTimeout(() => {
            const lastSlice = [...logs].pop().args[0];

            if (lastSlice) {
               res(lastSlice);
               unsubscribe();
            } else {
               res(undefined);
            }
         }, 10000);
      });
   };

   const createSlice = async (values: CreateSliceRequestData): Promise<string> => {
      const { slice } = values;
      const keyRequest = await fetch("/api/pinataKey");
      const keyData = await keyRequest.json();

      return new Promise((res, rej) => {
         pinata.upload
            .json(slice, {
               metadata: { name: `Slice-${slice.name}` },
            })
            .key(keyData.JWT)
            .then(({ IpfsHash }) => {
               const sliceDetails = {
                  uniswapRouter: UNISWAP_ROUTER_ADDRESS,
                  usdc: USDC_ADDRESS,
                  name: slice.name,
                  symbol: slice.symbol,
                  metadataUri: IpfsHash,
               };

               writeContract({
                  contractId: ContractId.fromEvmAddress(0, 0, SLICE_FACTORY_ADDRESS),
                  abi: sliceFactoryAbi,
                  functionName: "deploySlice",
                  args: [uuid.v4(), sliceDetails],
               })
                  .then((tx) => {
                     watch(tx as string, {
                        onSuccess: (transaction) => {
                           res(transaction.transaction_id);

                           return transaction;
                        },
                        onError: (transaction, err) => {
                           rej(err);

                           return transaction;
                        },
                     });
                  })
                  .catch((err) => {
                     rej(err);
                  });
            });
      });
   };
   
   return {
      createSlice,
      waitForLastSliceDeployed,
      addSliceTokenAssetsMutation,
      rebalanceSliceMutation,
   };
}
