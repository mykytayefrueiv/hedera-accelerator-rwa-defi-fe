"use client";

import React, { useState } from "react";
import Select, { SingleValue } from "react-select";
import { Formik, Form, Field } from "formik";
import { useBuildingDetails } from "@/hooks/useBuildingDetails";
import { colourStyles } from "@/consts/theme";
import { USDC_ADDRESS } from "@/services/contracts/addresses";
import { MintRequestPayload } from "@/types/erc3643/types";
import { useEvmAddress, useWriteContract } from "@buidlerlabs/hashgraph-react-wallets";
import { ContractId } from "@hashgraph/sdk";
import { tokenAbi } from "@/services/contracts/abi/tokenAbi";
import { tokens } from "@/consts/tokens";

type Props = {
    buildingAddress?: `0x${string}`;
};

const initialMintValues = {
    amount: '',
    token: '',
}; 

export const MintERC3643TokenForm = (props: Props) => {
    const { deployedBuildingTokens } = useBuildingDetails(props.buildingAddress);
    const { writeContract } = useWriteContract();
    const [txHash, setTxHash] = useState<string>();
    const [txError, setTxError] = useState<string>();
    const [txInProgress, setTxInProgress] = useState(false);
    const { data: evmAddress } = useEvmAddress();

    const handleSubmit = async (values: MintRequestPayload) => {
        setTxInProgress(true);

        try {
            const tokenDecimals = tokens.find(tok => tok.address === values.token)?.decimals || 18;
            const tx = await writeContract({
                contractId: ContractId.fromEvmAddress(0, 0, values.token),
                abi: tokenAbi,
                functionName: "mint",
                args: [evmAddress, BigInt(Math.floor(parseFloat(values.amount!) * 10 ** tokenDecimals))],
            });
            setTxHash(tx as string);
        } catch (err) {
            setTxError((err as { message: string })?.message ?? '');
        } finally {
            setTxInProgress(false);
        }
    };

    const tokenSelectOptions = [
        ...deployedBuildingTokens.map(tok => ({
            value: tok.tokenAddress,
            label: tok.tokenAddress,
        })),
        {
            value: USDC_ADDRESS,
            label: 'USDC',
        }
    ];

    return (
        <div className="bg-white rounded-lg p-8 border border-gray-300">
            <h3 className="text-xl font-semibold mt-5 mb-5">
                Mint ERC3643 Token
            </h3>

            <Formik
                initialValues={initialMintValues}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form className="space-y-4">
                        {/* Token Address */}
                        <div>
                            <label className="block text-md font-semibold text-purple-400">
                                Select Token Address
                            </label>
                            <Select
                                styles={colourStyles}
                                className="mt-2"
                                placeholder="Token Address"
                                options={tokenSelectOptions}
                                onChange={(
                                    option: SingleValue<{ value: string; label: string }>,
                                ) => {
                                    setFieldValue('token', option?.value);
                                }}
                                value={tokenSelectOptions.find(
                                    (opt) => opt.value === values.token,
                                )}
                            />
                        </div>

                        {/* Token Amount */}
                        <div>
                            <label className="block text-md font-semibold text-purple-400">
                                Token Amount
                            </label>
                            <Field
                                name="amount"
                                className="input input-bordered w-full mt-2"
                                placeholder="e.g. 100"
                            />
                        </div>

                        <div className="flex gap-5 mt-5">
                            <button
                                className="btn btn-primary"
                                type="submit"
                                disabled={txInProgress}
                            >
                                {txInProgress ? (
                                <>
                                    <span className="loading loading-spinner" />
                                    Minting in progress...
                                </>
                                ) : "Mint Token"}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>

            {txHash && (
                <div className="mt-4">
                    <span className="text-xs text-purple-600">
                        Add Liquidity Success, Tx Hash: {txHash}
                    </span>
                </div>
            )}
            {txError && (
                <div className="mt-4">
                    <span className="text-xs text-purple-600">
                        Add Liquidity Tx Error: {txError}
                    </span>
                </div>
            )}
        </div>
    );
};
