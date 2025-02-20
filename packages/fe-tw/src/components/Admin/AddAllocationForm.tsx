import { Formik, Field, Form } from "formik"
import React, { useState, useMemo, useCallback } from "react";
import Select, { SingleValue } from "react-select";
import { Button } from "react-daisyui";
import { useWriteContract, useWatchTransactionReceipt } from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";
import { sliceAbi } from "@/services/contracts/abi/sliceAbi";
import { AddAllocationRequest, BuildingToken } from "@/types/erc3643/types";
import { useSlicesData } from "@/hooks/useSlicesData";
import { useBuildings } from "@/hooks/useBuildings";
import { BuildingDetailsView } from "@/components/FetchViews/BuildingDetailsView";

// todo: maybe we have other place to get `PRICE_ID` from
const PRICE_ID = "0x1111111111111111111111111111111111111111111111111111111111111111";
const initialValues = {
    tokenAsset: '',
    allocation: undefined,
};

const colourStyles = {
    control: (styles: object) => ({ ...styles, paddingTop: 6, paddingBottom: 6, borderRadius: 8, backgroundColor: "#fff" }),
    option: (styles: any) => ({
        ...styles,
        backgroundColor: "#fff",
        color: "#000",
        ":active": {
            ...styles[":active"],
            backgroundColor: "#9333ea36",
        },
        ":focused": {
            backgroundColor: "#9333ea36",
        },
    }),
};

type Props = {
    handleBack: () => void,
};

export const AddAllocationForm = ({ handleBack }: Props) => {
    const { writeContract } = useWriteContract();
    const { watch } = useWatchTransactionReceipt();
    const [isLoading, setIsLoading] = useState(false);
    const [txResult, setTxResult] = useState<string>();
    const [sliceAddress, setSliceAddress] = useState<`0x${string}`>();
    const [buildingDeployedTokens, setBuildingDeployedTokens] = useState<BuildingToken[]>([]);
    const { buildings } = useBuildings();
    const { sliceAddresses } = useSlicesData();
    // const { autoCompounders, vaults } = useCompoundersAndVaultsData();
    
    const buildingAssetsOptions = useMemo(() =>
        buildings.map(token => ({
            value: token.address as string,
            label: token.title,
        })).filter(building => !!buildingDeployedTokens.find(token => token.buildingAddress === building.value)),
    [buildings?.length, buildingDeployedTokens?.length]);

    const sliceOptions = useMemo(() =>
        sliceAddresses.map(addr => ({
            value: addr,
            // todo: use slice name, not address
            label: addr,
        })),
    [sliceAddresses?.length]);

    const submitAddAllocationForm = useCallback((values: AddAllocationRequest) => {
        setIsLoading(true);
        /** 
         * const token = buildingDeployedTokens.find(deployedToken => deployedToken.buildingAddress === values.tokenAsset)?.tokenAddress;
            const tokenVault = vaults.find(vault => vault === token);
            const tokenAutoCompounder = autoCompounders.find(compounder => compounder === tokenVault);
        **/
        const tokenAutoCompounder = '0xEd3b041a44E2021075E38e01cc763F31F5F85330';

        writeContract({
            contractId: ContractId.fromEvmAddress(0, 0, sliceAddress as `0x${string}`),
            abi: sliceAbi,
            functionName: "addAllocation",
            // todo: find a best way to get auto compounder from building token
            args: [tokenAutoCompounder, PRICE_ID, values.allocation],
        }).then(tx => {
            watch(tx as string, {
                onSuccess: (transaction) => {
                    setIsLoading(false);
                    setTxResult(transaction.transaction_id);

                    return transaction;
                },
                onError: (transaction) => {
                    setIsLoading(false);
                    setTxResult(transaction.transaction_id);

                    return transaction;
                },
            });
        });
    }, [buildingDeployedTokens, sliceAddress]);

    return (
        <>
            <Formik
                initialValues={initialValues}
                onSubmit={submitAddAllocationForm}
            >
                {({ setFieldValue, values }) => (
                    <Form className="space-y-4">
                        <div>
                            <label className="block text-md font-semibold text-purple-400">Select Slice</label>
                            <Select
                                styles={colourStyles}
                                className="mt-2"
                                placeholder="e.g. 0x"
                                options={sliceOptions}
                                onChange={(option: SingleValue<{ value: string; label: string }>) => {
                                    setSliceAddress(option?.value as `0x${string}`)
                                }}
                                value={sliceAddress
                                    ? {
                                        value: sliceAddress,
                                        label: sliceOptions.find((t) => t.value === sliceAddress)?.label || sliceAddress,
                                    } : null
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-md font-semibold text-purple-400">Token Allocation (%)</label>
                            <Field
                                name="allocation"
                                className="input input-bordered w-full mt-2"
                                placeholder="e.g. 1"
                            />
                        </div>
                        <div>
                            <label className="block text-md font-semibold text-purple-400">Select Token Asset (Building Token)</label>
                            <Select
                                styles={colourStyles}
                                className="mt-2"
                                placeholder="e.g. 0x"
                                options={buildingAssetsOptions}
                                onChange={(option: SingleValue<{ value: string; label: string }>) => {
                                    setFieldValue('tokenAsset', option?.value || '');
                                }}
                                value={
                                    values.tokenAsset
                                        ? {
                                            value: values.tokenAsset,
                                            label:
                                                buildingAssetsOptions.find((t) => t.value === values.tokenAsset)
                                                    ?.label || values.tokenAsset,
                                        }
                                        : null
                                }
                            />
                        </div>
                        <div className="flex gap-5 mt-5">
                            <Button
                                className="pr-20 pl-20"
                                type="button"
                                color="accent"
                                onClick={handleBack}
                            >Back</Button>
                            <Button
                                className="pr-20 pl-20"
                                type="submit"
                                color="primary"
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Allocation Adding...' : 'Add'}
                            </Button>
                        </div>
                        {txResult && <div className="flex mt-5">
                            <p className="text-sm font-bold text-purple-600">
                                Allocation Tx Hash: {txResult}
                            </p>
                        </div>}
                    </Form>
                )}
            </Formik>
            {buildings.map(building => (
                <BuildingDetailsView key={building.id} address={building.address as `0x${string}`} setBuildingTokens={setBuildingDeployedTokens} />
            ))}
        </>
    );
};
