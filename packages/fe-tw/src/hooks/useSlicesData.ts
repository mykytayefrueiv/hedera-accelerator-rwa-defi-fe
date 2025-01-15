import { watchContractEvent } from '@/services/contracts/watchContractEvent';
import { useWriteContract } from '@buidlerlabs/hashgraph-react-wallets';
import { ContractId } from "@hashgraph/sdk";
import { sliceFactoryAbi } from '@/services/contracts/abi/sliceFactoryAbi';
import { sliceFactoryAddress } from "@/services/contracts/addresses";
import { useState } from 'react';
import { QueryData } from '@/types/erc3643/types';
import * as uuid from 'uuid';

export const usdcAddress = "0x0000000000000000000000000000000000001549";
export const uniswapRouterAddress = "0xACE99ADFd95015dDB33ef19DCE44fee613DB82C2";
export const pythOracleAddress = "0x330C40b17607572cf113973b8748fD1aEd742943";

export function useSlicesData() {
  const { writeContract } = useWriteContract();
  const [slicesAddresses, setSlicesAddresses] = useState<string[]>([]);

  const handleCreateSlice = async () => {
    const sliceDetails = {
      pyth: pythOracleAddress,
      uniswapRouter: uniswapRouterAddress,
      usdc: usdcAddress,
    };

    return await writeContract({
      contractId: ContractId.fromEvmAddress(0, 0, sliceFactoryAddress),
      abi: sliceFactoryAbi,
      functionName: "deploySlice",
      args: [uuid.v4(), sliceDetails],
    });
  };

  watchContractEvent({
    address: sliceFactoryAddress,
    abi: sliceFactoryAbi,
    eventName: "SliceDeployed",
    onLogs: (data) => {
      setSlicesAddresses(prev => (prev.includes((data[0] as unknown as QueryData<string[]>).args[0]) ?
        prev :
        [...prev, (data[0] as unknown as QueryData<string[]>).args[0]]
      ))
    },
  })

  return {
    handleCreateSlice,
    slicesAddresses,
  };
}
