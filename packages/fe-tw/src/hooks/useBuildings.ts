"use client";

import { useState, useEffect } from "react";

import { buildingFactoryAddress } from "@/services/contracts/addresses";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { BuildingData, BuildingNFTAttribute, BuildingNFTData } from "@/types/erc3643/types";
import { buildingFinancialMock } from "@/consts/buildings";
import { appConfig } from "@/consts/config";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { readContract } from "@/services/contracts/readContract";

/**
 * Fetching building NFT metadata from Pinata cloud
 * @param tokenUri NFT location on Pinata cloud server
 */
const fetchBuildingNFTMetadata = async (tokenUri: string) => {
    const response = await fetch(tokenUri.replace('ipfs://', `${appConfig.pinataDomainUrl}/ipfs/`));

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
        id: data.address,
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

export const fetchBuildingNFTsMetadata = async (buildingsAddresses: `0x${string}`[], buildings: BuildingData[]) => {
    const buildingAddressesProxiesData = await Promise.all(
        buildingsAddresses
            .filter(address => !buildings.find(build => build.address === address))
            .map((address) => readBuildingDetails(address))
    );
    const buildingNFTsData = await Promise.all(buildingAddressesProxiesData.map(proxy => fetchBuildingNFTMetadata(checkIsValidIPFSTokenUri(proxy[0][2]) ? proxy[0][2] : buildingAddressesProxiesData[0][0][2])));

    return { buildingAddressesProxiesData, buildingNFTsData };
};

const checkIsValidIPFSTokenUri = (tokenUri: string) => {
    return !!tokenUri.match(`${appConfig.pinataDomainUrl}/ipfs/`);
};

const readBuildingDetails = (address: `0x${string}`) => readContract({
    functionName: 'getBuildingDetails',
    address: buildingFactoryAddress,
    abi: buildingFactoryAbi,
    args: [address],
});

export function useBuildings() {
    const [buildingsAddresses, setBuildingAddresses] = useState<`0x${string}`[]>([]);
    const [buildings, setBuildings] = useState<BuildingData[]>([]);
    const [newBuildingLogs, setNewBuildingLogs] = useState<{ args: `0x${string}`[] }[]>([]);

    const fetchBuildingNFTs = async () => {
        const { buildingNFTsData, buildingAddressesProxiesData } = await fetchBuildingNFTsMetadata(buildingsAddresses, buildings);

        setBuildings(convertBuildingNFTsData(buildingNFTsData.map((data, id) => ({
            ...data,
            address: buildingAddressesProxiesData[id][0][0],
            copeIpfsHash: buildingAddressesProxiesData[id][0][2]?.replace(`${appConfig.pinataDomainUrl}/ipfs/`, ''),
        }))));
    };

    watchContractEvent({
        address: buildingFactoryAddress,
        abi: buildingFactoryAbi,
        eventName: 'NewBuilding',
        onLogs: (data) => {
            setNewBuildingLogs(prev => !prev.length ? data as unknown as { args: `0x${string}`[] }[] : prev);
        },
    });

    useEffect(() => {
        if (buildingsAddresses?.length) {
            fetchBuildingNFTs();
        }
    }, [buildingsAddresses?.length]);

    useEffect(() => {
        setBuildingAddresses(newBuildingLogs.map(log => log.args[0]));
    }, [newBuildingLogs?.length]);

    return { buildings };
}
