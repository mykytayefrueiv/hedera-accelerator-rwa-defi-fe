import { useEffect, useState } from "react";
import { watchContractEvent } from "@/services/contracts/watchContractEvent";
import { VAULT_FACTORY_ADDRESS, AUTO_COMPOUNDER_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { autoCompounderFactoryAbi } from "@/services/contracts/abi/autoCompounderFactoryAbi";
import { vaultFactoryAbi } from "@/services/contracts/abi/vaultFactoryAbi";
import { QueryData } from "@/types/erc3643/types";

export const useCompoundersAndVaultsData = () => {
    const [vaults, setVaults] = useState<any[]>([]);
    const [autoCompounders, setAutoCompounders] = useState<any[]>([]);
    const [vaultLogs, setVaultLogs] = useState<any[]>([]);
    const [autoCompounderLogs, setAutoCompounderLogs] = useState<any[]>([]);

    useEffect(() => {
        watchContractEvent({
            address: AUTO_COMPOUNDER_FACTORY_ADDRESS as `0x${string}`,
            abi: autoCompounderFactoryAbi,
            eventName: 'AutoCompounderDeployed',
            onLogs: (data) => {
                setAutoCompounderLogs(data.map(log => (log as unknown as QueryData<string[]>).args[0]));
            },
        });
        
        watchContractEvent({
            address: VAULT_FACTORY_ADDRESS as `0x${string}`,
            abi: vaultFactoryAbi,
            eventName: 'VaultDeployed',
            onLogs: (data) => {
                setVaultLogs(data.map(log => (log as unknown as QueryData<string[]>).args[0]));
            },
        });
    }, [setVaultLogs, setAutoCompounderLogs]);

    useEffect(() => {
        setVaults(vaultLogs);
    }, [vaultLogs?.length]);

    useEffect(() => {
        setAutoCompounders(autoCompounderLogs);
    }, [autoCompounderLogs?.length]);

    return {
        vaults,
        autoCompounders,
    };
};
