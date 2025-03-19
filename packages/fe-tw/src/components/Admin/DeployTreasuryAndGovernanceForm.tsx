import { useGovernanceAndTreasuryDeployment } from "@/hooks/useGovernanceAndTreasuryDeployment";
import { Formik, Field, Form } from "formik";
import { Button } from "react-daisyui";
import { useState } from "react";

type Props = {
    buildingAddress?: `0x${string}`,
    buildingTokenAddress?: `0x${string}`,
}

const initialValuesGovernance = {
    governanceName: '',
};

const initialValuesTreasury = {
    reserve: '',
    npercentage: '',
};

export const DeployTreasuryAndGovernanceForm = ({ buildingAddress, buildingTokenAddress }: Props) => {
    const [txError, setTxError] = useState<string>();
    const [txSuccess, setTxSuccess] = useState<string>();
    const [formIndex, setFormIndex] = useState<number>(0);
    
    const { deployBuildingGovernance, deployBuildingTreasury, treasuryAddress } =
        useGovernanceAndTreasuryDeployment(buildingAddress, buildingTokenAddress);
    
    const handleDeployBuildingTreasury = async (values: any) => {
        try {
            const tx = await deployBuildingTreasury(values);

            setTxSuccess(tx);
            setFormIndex(1);
        } catch (err) {
            setTxError((err as { message: string })?.message);
        }
    };

    const handleDeployBuildingGovernance = async (values: any) => {
        try {
            const tx = await deployBuildingGovernance(values);

            setTxSuccess(tx);
        } catch (err) {
            setTxError((err as { message: string })?.message);
        }
    };

    return (
            <div className="mt-10 bg-white p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-4">{formIndex === 0 ? 'Deploy Treasury' : 'Deploy Governance'}</h3>
                {!buildingTokenAddress && (
                    <div className="mt-5 mb-5 bg-red-200 p-5">
                        <p className="text-sm">In order to deploy treasury and governance deploy building ERC3643 token first.</p>
                    </div>
                )}
                {formIndex === 0 ? (
                    <Formik initialValues={initialValuesTreasury} onSubmit={handleDeployBuildingTreasury}>
                        {({ values }) => (
                            <Form className="space-y-4">
                                <div>
                                    <label className="block text-md font-semibold text-purple-400">
                                        Reserve
                                    </label>
                                    <Field
                                        name="reserve"
                                        type="text"
                                        className="input input-bordered w-full mt-2"
                                        placeholder="E.g: 0x"
                                    />
                                </div>
                                <div>
                                    <label className="block text-md font-semibold text-purple-400">
                                        NPercentage
                                    </label>
                                    <Field
                                        name="npercentage"
                                        type="text"
                                        className="input input-bordered w-full mt-2"
                                        placeholder="E.g: 0x"
                                    />
                                </div>
                                {treasuryAddress && <div>
                                    <p className="text-md font-semibold">Treasury address: {treasuryAddress}</p>
                                </div>}
                                <Button
                                    onClick={() =>
                                        deployBuildingTreasury(values)
                                    }
                                    className="pr-10 pl-10" color="secondary" type="button"
                                    disabled={!buildingTokenAddress || !values.npercentage || !values.reserve}
                                >
                                    Deploy
                                </Button>
                            </Form>
                        )}
                    </Formik>
                ): (
                    <Formik initialValues={initialValuesGovernance} onSubmit={handleDeployBuildingGovernance}>
                        {({ values }) => (
                            <Form className="space-y-4">
                                <div>
                                    <label className="block text-md font-semibold text-purple-400">
                                        Governance Name
                                    </label>
                                    <Field
                                        name="governanceName"
                                        type="text"
                                        className="input input-bordered w-full mt-2"
                                        placeholder="E.g: 0x"
                                    />
                                </div>
                                <Button
                                    onClick={() =>
                                        deployBuildingGovernance(values)
                                    }
                                    className="pr-10 pl-10" color="secondary" type="button"
                                    disabled={!values.governanceName}
                                >
                                    Deploy
                                </Button>
                            </Form>
                        )}
                    </Formik>    
                )}
                {txSuccess && (
                    <div className="mt-4 text-sm text-gray-700">
                        Tx Hash: <span className="font-bold">{txSuccess}</span>
                    </div>
                )}
                {txError && (
                    <div className="mt-4 text-sm text-gray-700">
                        Tx Error: {txError}
                    </div>
                )}
            </div>
    );
};
