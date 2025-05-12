import { useWatchTransactionReceipt, useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";
import { useEffect, useState } from "react";
import * as uuid from "uuid";
import { sliceAbi } from "@/services/contracts/abi/sliceAbi";
import { sliceFactoryAbi } from "@/services/contracts/abi/sliceFactoryAbi";
import { UNISWAP_ROUTER_ADDRESS, USDC_ADDRESS, SLICE_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import type { CreateSliceRequestData, SliceDepositRequestData } from "@/types/erc3643/types";
import { pinata } from "@/utils/pinata";
import { useExecuteTransaction } from "./useExecuteTransaction";

const CHAINLINK_PRICE_ID = "0x269501f5674BeE3E8fef90669d3faa17021344d0";

const calculateAllocationWeight = (allocTokens: string[], weight: number) => {
   return Math.round(weight / allocTokens.length);
};

export function useCreateSlice(deployedSlice?: `0x${string}`) {
   const { writeContract } = useWriteContract();
   const { watch } = useWatchTransactionReceipt();
   const { executeTransaction } = useExecuteTransaction();
   const [sliceData, setSliceData] = useState<CreateSliceRequestData>();
   const [sliceDeployed, setSliceDeployed] = useState(false);
   const [addSliceAllocationTxId, setAddSliceAllocationTxId] = useState<string>();

   const allocations = async (assets: string[], weight: number, assetId: number, txResults: string[]) => {
      if (assets[assetId]) {
         const result = await executeTransaction(() =>
            writeContract({
               contractId: ContractId.fromEvmAddress(0, 0, deployedSlice!),
               abi: sliceAbi,
               functionName: "addAllocation",
               args: [assets[assetId], CHAINLINK_PRICE_ID, weight],
            }),
         );;

         return allocations(assets, weight, assetId + 1, [
            ...txResults, (result as { transaction_id: string }).transaction_id,
         ]);
      }

      return txResults;
   };
   
   const addSliceAllocation = async (values: CreateSliceRequestData): Promise<string[] | undefined> => {
      const { sliceAllocation } = values;
      const allocationWeight = calculateAllocationWeight(sliceAllocation.tokenAssets, Number(sliceAllocation.allocation));
      const allocationHashes = await allocations(sliceAllocation.tokenAssets, allocationWeight, 0, []);

      return allocationHashes;
   };

   const depositToSlice = async (values: SliceDepositRequestData): Promise<string> => {
      const txResult = await executeTransaction(() => writeContract({
         contractId: ContractId.fromEvmAddress(0, 0, deployedSlice!),
         abi: sliceAbi,
         functionName: "deposit",
         args: [values.aToken, values.amount],
      }));

      return (txResult as { transaction_id: string })?.transaction_id;
   };

   const createSlice = async (values: CreateSliceRequestData): Promise<string> => {
      const { slice } = values;
      const keyRequest = await fetch("/api/pinataKey");
      const keyData = await keyRequest.json();
      setSliceData(values);

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
                           setSliceDeployed(true);

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

   useEffect(() => {
      if (deployedSlice && sliceDeployed && !!sliceData) {
         addSliceAllocation(sliceData).then(txIds => {
            setAddSliceAllocationTxId(txIds?.join(','));
         });
      }
   }, [deployedSlice, sliceDeployed]);

   
   return {
      createSlice,
      addSliceAllocation,
      depositToSlice,
      addSliceAllocationTxId,
   };
}
