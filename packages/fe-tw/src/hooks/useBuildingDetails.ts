import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { buildingAbi } from "@/services/contracts/abi/buildingAbi";
import { BuildingData, QueryData } from "@/types/erc3643/types";
import { useEvmAddress } from "@buidlerlabs/hashgraph-react-wallets";
import { useMemo, useState } from "react";

export function useBuildingDetails(building: BuildingData) {
    const [buildingOwner, setBuildingOwner] = useState<`0x${string}`>();
    const { data: evmAddress } = useEvmAddress();

    watchContractEvent({
        address: building?.address as `0x${string}`,
        abi: buildingAbi,
        eventName: 'OwnershipTransferred',
        onLogs: (data) => {
            const owner = (data[0] as unknown as QueryData<`0x${string}`[]>)?.args?.[1];

            setBuildingOwner(owner);
        },
    });

    const isBuildingAdmin = useMemo(() => {
        if (!!buildingOwner) {
            return buildingOwner === evmAddress;
        }

        return false;
    }, [buildingOwner]);

    return { isBuildingAdmin };
}
