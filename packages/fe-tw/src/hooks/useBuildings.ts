"use client";

import { useState, useEffect } from "react";

import { BUILDING_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import {
	convertBuildingNFTsData,
	fetchBuildingNFTsMetadata,
} from "@/services/buildingService";
import type { BuildingData } from "@/types/erc3643/types";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";

export function useBuildings() {
	const [buildingsAddresses, setBuildingAddresses] = useState<`0x${string}`[]>(
		[],
	);
	const [buildings, setBuildings] = useState<BuildingData[]>([]);
	const [newBuildingLogs, setNewBuildingLogs] = useState<
		{ args: `0x${string}`[] }[]
	>([]);

	const fetchBuildingNFTs = async () => {
		const { buildingNFTsData, buildingAddressesProxiesData } =
			await fetchBuildingNFTsMetadata(buildingsAddresses, buildings);

		setBuildings(
			convertBuildingNFTsData(
				buildingNFTsData.map((data, id) => ({
					...data,
					address: buildingAddressesProxiesData[id][0][0],
					copeIpfsHash: buildingAddressesProxiesData[id][0][2],
				})),
			),
		);
	};

	watchContractEvent({
		address: BUILDING_FACTORY_ADDRESS,
		abi: buildingFactoryAbi,
		eventName: "NewBuilding",
		onLogs: (data) => {
			setNewBuildingLogs((prev) =>
				!prev.length ? (data as unknown as { args: `0x${string}`[] }[]) : prev,
			);
		},
	});

	useEffect(() => {
		if (buildingsAddresses?.length) {
			fetchBuildingNFTs();
		}
	}, [buildingsAddresses?.length]);

	useEffect(() => {
		setBuildingAddresses(newBuildingLogs.map((log) => log.args[0]));
	}, [newBuildingLogs?.length]);

	return { buildings };
}
