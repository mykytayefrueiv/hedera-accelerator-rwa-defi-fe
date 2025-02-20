import { sliceAbi } from '@/services/contracts/abi/sliceAbi';
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { useState } from "react";

export const useSliceDetails = (sliceAddress: `0x${string}`) => {
    const [sliceDetailLogs, setSliceDetailLogs] = useState<any[]>([]);
    const [sliceDetails, setSliceDetails] = useState<any[]>([]);

    watchContractEvent({
        address: sliceAddress,
        abi: sliceAbi,
        eventName: 'AllocationAdded',
        onLogs: (data) => {
            setSliceDetailLogs(data);
        },
    });

    return {
        sliceDetails,
    };
}
