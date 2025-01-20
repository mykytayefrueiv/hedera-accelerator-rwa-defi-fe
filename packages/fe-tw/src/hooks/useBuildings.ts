"use client";

import { useState, useEffect } from "react";

import { useReadContract } from "@buidlerlabs/hashgraph-react-wallets";
import { buildingFactoryAddress } from "@/services/contracts/addresses";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { BuildingData, BuildingNFT, BuildingNFTAttribute, BuildingNFTData, QueryData } from "@/types/erc3643/types";
import { buildingFinancialMock } from "@/consts/buildings";
import { appConfig } from "@/consts/config";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";

/**
 * Fetching building NFT metadata from Pinata cloud
 * @param tokenUri NFT location on Pinata cloud server
 */
const fetchBuildingNFTMetadata = async (tokenUri: string) => {
    const response = await fetch(tokenUri);

    return response.json();
};

/**
 * Find attribute on building data
 * @param attributes All building attributes
 * @param 
 */
const findBuildingAttribute = (attributes: BuildingNFTAttribute[], attributeName: string) => {
    return attributes.find((attr) => attr.trait_type === attributeName)?.value ?? '--';
};

/**
 * Converts original building NFT metadata to a proper data format
 * @param buildingNFTsData Original building NFT JSON
*/
const convertBuildingNFTsData = (buildingNFTsData: BuildingNFTData[]): BuildingData[] => {
    return buildingNFTsData.map((data) => ({
        id: data.copeIpfsHash,
        title: data.name,
        description: data.description,
        imageUrl: `${appConfig.pinataDomainUrl}/ipfs/${data.image?.replace('ipfs://', '')}`,
        copeIpfsHash: data.copeIpfsHash,
        // todo: Use real references data.
        votingItems: [],
        partOfSlices: [],
        allocation: data.allocation,
        purchasedAt: data.purchasedAt,
        address: data.address,
        info: {
            // todo: Use real financial data.
            financial: buildingFinancialMock,
            demographics: {
                constructedYear: findBuildingAttribute(data.attributes, 'constructedYear'),
                type: findBuildingAttribute(data.attributes, 'type'),
                locationType: findBuildingAttribute(data.attributes, 'locationType'),
                size: findBuildingAttribute(data.attributes, 'size'),
                location: findBuildingAttribute(data.attributes, 'city'),
                state: findBuildingAttribute(data.attributes, 'state'),
            },
        },
    }));
};

export function useBuildings() {
    const [buildingsAddresses, setBuildingAddresses] = useState<string[]>([]);
    const [buildings, setBuildings] = useState<BuildingData[]>([]);

    const { readContract } = useReadContract();

    const requestBuildingNFTsData = async () => {
        const buildingAddressesProxies = await Promise.all(
            buildingsAddresses
                .filter(address => !buildings.find(build => build.address === address))
                .map((address) => readContract({
                    abi: buildingFactoryAbi,
                    address: buildingFactoryAddress,
                    functionName: 'getBuildingDetails',
                    args: [address],
                }))
        );

        if (buildingAddressesProxies.every(build => !!build)) {
            const buildingNFTsData = await Promise.all(buildingAddressesProxies.map(build => fetchBuildingNFTMetadata((build as { tokenURI: string })?.tokenURI)));

            setBuildings(convertBuildingNFTsData(buildingNFTsData.map((data, id) => ({
                ...data,
                address: (buildingAddressesProxies[id] as BuildingNFT)?.addr,
                copeIpfsHash: (buildingAddressesProxies[id] as BuildingNFT)?.tokenURI?.replace(`${appConfig.pinataDomainUrl}/ipfs/`, ''),
            }))));
        }
    };

    useEffect(() => {
        requestBuildingNFTsData();
    }, [buildingsAddresses]);

    watchContractEvent({
        address: buildingFactoryAddress,
        abi: buildingFactoryAbi,
        eventName: 'NewBuilding',
        onLogs: (data) => {
            setBuildingAddresses(prev => (prev.includes((data[0] as unknown as QueryData<string[]>).args[0]) ?
                prev :
                [...prev, (data[0] as unknown as QueryData<string[]>).args[0]]
            ))
        },
    });

    return { buildings };
}
