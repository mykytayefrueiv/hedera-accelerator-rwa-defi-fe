import { sliceAbi } from '@/services/contracts/abi/sliceAbi';
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { useState } from "react";

export const useSliceDetailsData = (sliceAddress: `0x${string}`) => {
    const [_, setLogs] = useState<{ args: `0x${string}`[] }[]>([]);

    watchContractEvent({
        address: sliceAddress,
        abi: sliceAbi,
        eventName: 'AllocationAdded',
        onLogs: (data) => {
            setLogs(prev => !prev.length ? data as unknown as { args: `0x${string}`[] }[] : prev);
        },
    });

    // todo: get building by building aToken

    return {
        sliceBuildings: [],
    }
}
