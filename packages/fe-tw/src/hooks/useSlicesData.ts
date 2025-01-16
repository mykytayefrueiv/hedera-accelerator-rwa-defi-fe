import { watchContractEvent } from '@/services/contracts/watchContractEvent';
import { sliceFactoryAbi } from '@/services/contracts/abi/sliceFactoryAbi';
import { sliceFactoryAddress } from "@/services/contracts/addresses";
import { useState } from 'react';
import { QueryData } from '@/types/erc3643/types';

export function useSlicesData() {
  const [slicesAddresses, setSlicesAddresses] = useState<string[]>([]);

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
    slicesAddresses,
  };
}
