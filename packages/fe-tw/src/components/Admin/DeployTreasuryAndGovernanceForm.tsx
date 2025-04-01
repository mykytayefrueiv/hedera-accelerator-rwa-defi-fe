import { useGovernanceAndTreasuryDeployment } from "@/hooks/useGovernanceAndTreasuryDeployment";
import { GovernancePayload, TreasuryPayload } from "@/types/erc3643/types";
import { Formik, Field, Form } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useBuildingDetails } from "@/hooks/useBuildingDetails";

type Props = {
    buildingAddress?: `0x${string}`,
    onGetNextStep: () => void,
}

const initialValuesGovernance = {
    governanceName: '',
};

const initialValuesTreasury = {
    reserve: '',
    npercentage: '',
};

export const DeployTreasuryAndGovernanceForm = ({ buildingAddress, onGetNextStep }: Props) => {
    const [formIndex, setFormIndex] = useState<number>(0);
    const { deployedBuildingTokens } = useBuildingDetails(buildingAddress);
    const buildingTokenAddress = deployedBuildingTokens?.[0]?.tokenAddress;

    const { deployBuildingGovernance, deployBuildingTreasury, treasuryAddress, governanceAddress } =
        useGovernanceAndTreasuryDeployment(buildingAddress, buildingTokenAddress);

    const handleDeployBuildingTreasury = async (values: TreasuryPayload) => {
        try {
            const tx = await deployBuildingTreasury(values);
            toast.success(tx, {
                icon: "✅",
                style: { maxWidth: "unset" },
                duration: 10000,
            });

            setFormIndex(1);
        } catch (err) {
            toast.error((err as { message: string })?.message, {
                icon: "❌",
                style: { maxWidth: "unset" },
            });
        }
    };

    const handleDeployBuildingGovernance = async (values: GovernancePayload) => {
        try {
            const tx = await deployBuildingGovernance(values);
            toast.success(tx, {
                icon: "✅",
                style: { maxWidth: "unset" },
                duration: 10000,
            });

            setTimeout(() => {
                onGetNextStep();
            }, 10000);
        } catch (err) {
            toast.error((err as { message: string })?.message, {
                icon: "❌",
                style: { maxWidth: "unset" },
            });
        }
    };

    useEffect(() => {
        if (!!buildingTokenAddress && !!treasuryAddress) {
            setFormIndex(1);
        }
    }, [treasuryAddress, governanceAddress, buildingTokenAddress]);

    return (
            <div className="mt-10 bg-white p-8 border rounded-lg">
                <h3 className="text-xl font-semibold mb-5">
                    {formIndex === 0 ? 'Deploy Treasury' : 'Deploy Governance'}
                </h3>
                {!buildingTokenAddress && (
                    <div className="bg-red-200 p-5 mt-5 mb-5">
                        <p className="text-sm">In order to deploy treasury and governance deploy building ERC3643 token first.</p>
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
                ): !governanceAddress && (
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
                                <div className="flex gap-5 mt-5">
                                    <button
                                        className="btn btn-primary bg-purple-600 text-white rounded-full"
                                        type="submit"
                                        disabled={!isValid}
                                    >
                                        Deploy
                                    </button>
                                    <button
                                        className="btn btn-primary bg-purple-600 text-white rounded-full"
                                        type="button"
                                        onClick={() => onGetNextStep()}
                                    >
                                        Add Liquidity
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>    
                )}
                {treasuryAddress && <div className="mt-2 text-sm text-purple-700" onClick={() => {
                    navigator.clipboard.writeText(treasuryAddress);
                    
                    toast.success("Address copied!", {
                        icon: "✅",
                        style: { maxWidth: "unset" },
                        duration: 5000,
                    });
                }}>
                    Treasury Address: <span className="font-bold cursor-pointer">{treasuryAddress}</span>
                </div>}
                {governanceAddress && <div className="mt-2 text-sm text-purple-700"  onClick={() => {
                    navigator.clipboard.writeText(governanceAddress);
                    
                    toast.success("Address copied!", {
                        icon: "✅",
                        style: { maxWidth: "unset" },
                        duration: 5000,
                    });
                }}>
                    Governance Address: <span className="font-bold cursor-pointer">{governanceAddress}</span>
                </div>}
            </div>
    );
};
