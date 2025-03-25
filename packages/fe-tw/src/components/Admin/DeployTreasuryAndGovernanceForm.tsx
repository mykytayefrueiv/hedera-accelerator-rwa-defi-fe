import { useGovernanceAndTreasuryDeployment } from "@/hooks/useGovernanceAndTreasuryDeployment";
import { GovernancePayload, TreasuryPayload } from "@/types/erc3643/types";
import { Formik, Field, Form } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

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
    
    const { deployBuildingGovernance, deployBuildingTreasury, treasuryAddress, governanceAddress } =
        useGovernanceAndTreasuryDeployment(buildingAddress, buildingTokenAddress);
    
    const handleDeployBuildingTreasury = async (values: TreasuryPayload) => {
        try {
            const tx = await deployBuildingTreasury(values);

            setTxSuccess(tx);
            setFormIndex(1);
        } catch (err) {
            setTxError((err as { message: string })?.message);
        }
    };

    const handleDeployBuildingGovernance = async (values: GovernancePayload) => {
        try {
            const tx = await deployBuildingGovernance(values);

            setTxSuccess(tx);
        } catch (err) {
            setTxError((err as { message: string })?.message);
        }
    };

    useEffect(() => {
        if (!!treasuryAddress && buildingTokenAddress) {
            setFormIndex(1);
        }
    }, [treasuryAddress, buildingTokenAddress]);

    return (
            <div className="mt-10 bg-white p-6 border rounded-lg">
                <h3 className="text-xl font-semibold mb-4">
                    {formIndex === 0 ? 'Deploy Treasury' : 'Deploy Governance'}
                </h3>
                {!buildingTokenAddress && (
                    <div className="mt-5 mb-5 bg-red-200 p-5">
                        <p className="text-sm">In order to deploy treasury and governance deploy building ERC3643 token first.</p>
                    </div>
                )}
                {formIndex === 1 && governanceAddress && (
                    <div className="mt-5 mb-5 bg-red-200 p-5">
                        <p className="text-sm">Governance already deployed to address {governanceAddress}.</p>
                    </div>
                )}
                {formIndex === 0 ? (
                    <Formik
                        initialValues={initialValuesTreasury}
                        validationSchema={Yup.object({
                            reserve: Yup.string().required("Required"),
                            npercentage: Yup.string().required("Required"),
                        })}
                        onSubmit={handleDeployBuildingTreasury}
                    >
                        {({ isValid }) => (
                            <Form className="space-y-4">
                                <div>
                                    <label className="block text-md font-semibold text-purple-400">
                                        Reserve
                                    </label>
                                    <Field
                                        name="reserve"
                                        type="text"
                                        className="input input-bordered w-full mt-2"
                                        placeholder="E.g: 10"
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
                                        placeholder="E.g: 10"
                                    />
                                </div>
                                <button
                                    className="btn btn-primary btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-purple-600 text-white rounded-full hover:bg-purple-700"
                                    type="submit"
                                    disabled={!isValid}
                                >
                                    Deploy
                                </button>
                            </Form>
                        )}
                    </Formik>
                ): (
                    <Formik
                        initialValues={initialValuesGovernance}
                        validationSchema={Yup.object({
                            governanceName: Yup.string().required("Required"),
                        })}
                        onSubmit={handleDeployBuildingGovernance}>
                        {({ isValid }) => (
                            <Form className="space-y-4">
                                <div>
                                    <label className="block text-md font-semibold text-purple-400">
                                        Governance Name
                                    </label>
                                    <Field
                                        name="governanceName"
                                        type="text"
                                        className="input input-bordered w-full mt-2"
                                        placeholder="E.g: MyGov"
                                    />
                                </div>
                                <button
                                    className="btn btn-primary btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-purple-600 text-white rounded-full hover:bg-purple-700"
                                    type="submit"
                                    disabled={!isValid}
                                >
                                    Deploy
                                </button>
                            </Form>
                        )}
                    </Formik>    
                )}
                {treasuryAddress && <div className="mt-5">
                    <p className="text-sm text-orange-900">Treasury address: {treasuryAddress}</p>
                </div>}
                {governanceAddress && <div className="mt-5">
                    <p className="text-sm text-orange-900">Governance address: {governanceAddress}</p>
                </div>}
                {txSuccess && (
                    <div className="mt-5 text-sm text-gray-700">
                        Tx Hash: <span className="font-bold">{txSuccess}</span>
                    </div>
                )}
                {txError && (
                    <div className="mt-5 text-sm text-gray-700">
                        Tx Error: <span className="font-bold">{txError}</span>
                    </div>
                )}
            </div>
    );
};
