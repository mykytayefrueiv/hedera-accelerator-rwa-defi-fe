import { useQuery } from '@tanstack/react-query';
import { getSliceTokensData } from '@/services/sliceService';
import { useWriteContract } from '@buidlerlabs/hashgraph-react-wallets';
import { ContractId } from "@hashgraph/sdk";
import { sliceFactoryAbi } from '@/services/contracts/abi/sliceFactoryAbi';
import { sliceFactoryAddress } from "@/services/contracts/addresses";

export const usdcAddress = "0x0000000000000000000000000000000000001549";
export const uniswapRouterAddress = "0xACE99ADFd95015dDB33ef19DCE44fee613DB82C2";
export const pythOracleAddress = "0x330C40b17607572cf113973b8748fD1aEd742943";

export function useSlices(sliceName: string) {
  const { writeContract } = useWriteContract();

  const handleCreateSlice = async () => {
    const salt = "";
    const sliceDetails = {
      pyth: pythOracleAddress,
      uniswapRouter: uniswapRouterAddress,
      usdc: usdcAddress,
    };

    return await writeContract({
      contractId: ContractId.fromEvmAddress(0, 0, sliceFactoryAddress),
      abi: sliceFactoryAbi,
      functionName: "deploySlice",
      args: [salt, sliceDetails],
    });
  };

  return {
    handleCreateSlice,
    getSliceData: useQuery({
      queryKey: ["sliceData", sliceName],
      queryFn: () => getSliceTokensData(sliceName),
    }),
  };
}
