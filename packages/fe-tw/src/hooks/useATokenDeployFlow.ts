import { useWriteContract, useWatchTransactionReceipt } from '@buidlerlabs/hashgraph-react-wallets';
import { autoCompounderFactoryAbi } from '@/services/contracts/abi/autoCompounderFactoryAbi';
import { vaultFactoryAbi } from '@/services/contracts/abi/vaultFactoryAbi';
import { AUTO_COMPOUNDER_FACTORY_ADDRESS, VAULT_FACTORY_ADDRESS } from '@/services/contracts/addresses';
import { ContractId } from "@hashgraph/sdk";
import { DeployAutoCompounderRequest, DeployVaultRequest } from '@/types/erc3643/types';

export const useATokenDeployFlow = () => {
    const { writeContract } = useWriteContract();
    const { watch } = useWatchTransactionReceipt();

    const handleDeployVault = async (data: DeployVaultRequest): Promise<string> => {
        return new Promise((res, rej) => {
            const salt = "";
            const details = {
                stakingToken: '0x',
                shareTokenName: data.shareTokenName,
                shareTokenSymbol: data.shareTokenSymbol,
                vaultRewardController: data.vaultRewardController,
                feeConfigController: data.feeConfigController,
            };
            const feeConfig = {
                receiver: data.receiver,
                token: data.token,
                feePercentage: data.feePercentage,
            };
            writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, VAULT_FACTORY_ADDRESS),
                abi: vaultFactoryAbi,
                functionName: "deployVault",
                args: [salt, details, feeConfig],
            }).then(tx => {
                watch(tx as string, {
                    onSuccess: (transaction) => {
                        res(transaction.transaction_id)

                        return transaction;
                    },
                    onError: (transaction, err) => {
                        rej(err)

                        return transaction;
                    },
                })
            }).catch(err => {
                rej(err);
            });
        });
    };

    const handleDeployAutoCompounder = async (data: DeployAutoCompounderRequest): Promise<string> => {
        return new Promise((res, rej) => {
            const salt = "";
            const details = {
                uniswapV2Router: '0x',
                vault: '0x',
                usdc: '0x',
                aTokenName: data.tokenName,
                aTokenSymbol: data.tokenSymbol,
            }
            writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, AUTO_COMPOUNDER_FACTORY_ADDRESS),
                abi: autoCompounderFactoryAbi,
                functionName: "deployAutoCompounder",
                args: [salt, details],
            }).then(tx => {
                watch(tx as string, {
                    onSuccess: (transaction) => {
                        res(transaction.transaction_id)

                        return transaction;
                    },
                    onError: (transaction, err) => {
                        rej(err)

                        return transaction;
                    },
                })
            }).catch(err => {
                rej(err);
            });
        });
    };

    return {
        handleDeployAutoCompounder,
        handleDeployVault,
    };
}