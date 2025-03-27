import { AddBuildingTokenLiquidityForm } from "@/components/Admin/AddBuildingTokenLiquidityForm";
import { MintERC3643TokenForm } from "@/components/Admin/MintBuildingTokenForm";
import { useState } from "react";

type Props = {
    buildingAddress: `0x${string}`,
};

export const BuildingMintAndAddLiquidity = (props: Props) => {
    const [deployStep, setDeployStep] = useState(0);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="breadcrumbs text-sm text-gray-700 mb-4">
                <ul>
                    {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                    <li onClick={() => setDeployStep(0)}>
                        Mint Token
                    </li>
                    {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                    <li onClick={() => setDeployStep(1)}>
                        Add Liquidity
                    </li>
                </ul>
            </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50 p-6 rounded-lg">
                    {/* Left Column: Description */}
                    <h2 className="text-2xl font-bold mb-4">What You Can Do</h2>
                    <p className="text-sm sm:text-base text-gray-700">
                        This interface allows you to mint tokens & add liquidity.
                    </p>
                    <p className="mt-4 text-sm sm:text-base text-gray-700">
                        As you want to trade tokens you need to mint USDC and add liquidity pair first.
                    </p>
                </div>
                <div>
                   {/* Right Column: Mint & Liquidity */}
                    {deployStep === 0 ?
                        <MintERC3643TokenForm buildingAddress={props.buildingAddress} /> :
                        <AddBuildingTokenLiquidityForm buildingAddress={props.buildingAddress} />
                    }
                </div>
            </div>
        </div>
    );
};
