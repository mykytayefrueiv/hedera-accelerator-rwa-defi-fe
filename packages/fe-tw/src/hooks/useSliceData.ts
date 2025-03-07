import { sliceAbi } from '@/services/contracts/abi/sliceAbi';
import { watchContractEvent } from '@/services/contracts/watchContractEvent';
import { useState } from 'react';

export const useSliceData = (sliceAddress: `0x${string}`) => {
  const [_sliceDetailLogs, setSliceDetailLogs] = useState<any[]>([]);
  const [sliceDetails, _setSliceDetails] = useState<{
    buildings: `0x${string}`[],
  }>({ buildings: [] });
  
  watchContractEvent({
      address: sliceAddress,
      abi: sliceAbi,
      eventName: 'AllocationAdded',
      onLogs: (data) => {
        setSliceDetailLogs(data);
      },
  });

  return { sliceDetails };
};
