"use client";

import { useState, useEffect, useCallback } from "react";

import { buildingFactoryAddress } from "@/services/contracts/addresses";
import { buildingFactoryAbi } from "@/services/contracts/abi/buildingFactoryAbi";
import { BuildingData, BuildingNFTAttribute, BuildingNFTData } from "@/types/erc3643/types";
import { buildingFinancialMock } from "@/consts/buildings";
import { appConfig } from "@/consts/config";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { readContract } from "@/services/contracts/readContract";
/**
    import { createPublicClient, http } from 'viem';
    import { useReadContract } from "@buidlerlabs/hashgraph-react-wallets";
    import { hederaTestnet } from 'viem/chains';

    const client = createPublicClient({
        chain: hederaTestnet,
        transport: http()
    });
**/

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
    const [logs, setLogs] = useState<{ args: `0x${string}`[] }[]>([]);
    /**
        const { readContract } = useReadContract({
            chain: client.chain,
        });
        ({
        address: buildingFactoryAddress,
        abi: buildingFactoryAbi,
        functionName: 'getBuildingDetails',
        args: [address],
        }))
    **/

    const fetchBuildingNFTs = useCallback(async () => {
        const buildingAddressesProxies = await Promise.all(
            buildingsAddresses
                .filter(address => !buildings.find(build => build.address === address))
                .map((address) => readBuildingDetails(address))
        );
        const buildingNFTsData = await Promise.all(buildingAddressesProxies.map(proxy => fetchBuildingNFTMetadata(checkIsValidIPFSTokenUri(proxy[0][2]) ? proxy[0][2] : buildingAddressesProxies[0][0][2])));

        setBuildings(convertBuildingNFTsData(buildingNFTsData.map((data, id) => ({
            ...data,
            address: buildingAddressesProxies[id][0][0],
            copeIpfsHash: buildingAddressesProxies[id][0][2].replace(`${appConfig.pinataDomainUrl}/ipfs/`, ''),
        }))));
    }, [buildingsAddresses, buildings]);

    watchContractEvent({
        address: buildingFactoryAddress,
        abi: buildingFactoryAbi,
        eventName: 'NewBuilding',
        onLogs: (data) => {
            setLogs(prev => !prev.length ? data as unknown as { args: `0x${string}`[] }[] : prev);
        },
    });

    useEffect(() => {
        if (buildingsAddresses?.length) {
            fetchBuildingNFTs();
        }
    }, [buildingsAddresses?.length]);

    useEffect(() => {
        setBuildingAddresses(logs.map(log => log.args[0]));
    }, [logs?.length]);

    return { buildings };
}
