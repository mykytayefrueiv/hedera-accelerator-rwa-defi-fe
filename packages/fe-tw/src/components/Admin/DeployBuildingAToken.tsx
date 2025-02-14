import { useATokenDeployFlow } from "@/hooks/useATokenDeployFlow";
import { DeployAutoCompounderRequest, DeployVaultRequest } from "@/types/erc3643/types";
import { Formik, Field, Form } from "formik"
import React, { useState } from "react";
import { Button } from "react-daisyui";

/**
 * Deploy Vault form
 */
const DeployVaultForm = (
    { handleDeploy }: { handleDeploy: (data: DeployVaultRequest) => Promise<string> }
) => {
    const initialValues = {
        stakingToken: '',
        shareTokenName: '',
        shareTokenSymbol: '',
        vaultRewardController: '',
        feeConfigController: '',
        receiver: '',
        token: '',
        feePercentage: BigInt(0),
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleDeploy}
        >
            <Form className="space-y-4">
                <></>
                <Button
                    className="pr-10 pl-10"
                    type="submit"
                    color="primary"
                >Deploy</Button>
            </Form>
        </Formik>
    );
};

/**
 * Deploy AutoCompounder form
 */
const DeployAutoCompounderForm = (
    { handleDeploy }: { handleDeploy: (data: DeployAutoCompounderRequest) => Promise<string> }
) => {
    const initialValues = {
        tokenName: '',
        tokenSymbol: '',
    };

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handleDeploy}
        >
            <Form className="space-y-4">
                <div>
                    <label className="block text-md font-semibold text-purple-400">Token name</label>
                    <Field
                        name="tokenName"
                        className="input input-bordered w-full mt-2"
                        placeholder="e.g. Solana"
                    />
                </div>
                <div>
                    <label className="block text-md font-semibold text-purple-400">Token symbol</label>
                    <Field
                        name="tokenSymbol"
                        className="input input-bordered w-full mt-2"
                        placeholder="e.g. SOL"
                    />
                </div>
                <Button
                    className="pr-10 pl-10"
                    type="submit"
                    color="primary"
                >Deploy</Button>
            </Form>
        </Formik>
    );
};

export const DeployBuildingAToken = () => {
    const [deployStep, setDeployStep] = useState(1);
    const { handleDeployAutoCompounder, handleDeployVault } = useATokenDeployFlow();

    return deployStep === 1 ?
        <DeployAutoCompounderForm handleDeploy={handleDeployAutoCompounder} /> :
        <DeployVaultForm handleDeploy={handleDeployVault} />;
};
