"use client";

import { DeployBuilding } from "@/components/Account/DeployBuilding";
import { DeployBuildingMetadata } from "@/components/Account/DeployBuildingMetadata";
import { useMemo, useState } from "react";
import { AddBuildingTokenLiquidityForm } from "./AddBuildingTokenLiquidityForm";
import { AdminInfoPanel } from "./AdminInfoPanel";
import { DeployBuildingERC3643TokenForm } from "./DeployBuildingERC3643TokenForm";

export function BuildingManagementView() {
	const [currentSetupStep, setCurrentSetupStep] = useState(1);
	const [selectedBuildingAddress, setSelectedBuildingAddress] =
		useState<`0x${string}`>();
	const [deployedMetadataIPFS, setDeployedMetadataIPFS] = useState("");

	const renderSetupStepView = useMemo(() => {
		if (currentSetupStep === 1) {
			return (
				<DeployBuildingMetadata
					setDeployedMetadataIPFS={setDeployedMetadataIPFS}
					onBuildingDeployed={() => {
						setCurrentSetupStep(2);
					}}
				/>
			);
		}

		if (currentSetupStep === 2) {
			return (
				<DeployBuilding
					deployedMetadataIPFS={deployedMetadataIPFS}
					onBuildingDeployed={() => {
						setCurrentSetupStep(3);
					}}
				/>
			);
		}

		if (currentSetupStep === 3) {
			return (
				<DeployBuildingERC3643TokenForm
					onGetLiquidityView={(buildingAddress: `0x${string}`) => {
						setCurrentSetupStep(4);
						setSelectedBuildingAddress(buildingAddress);
					}}
					onGetDeployBuildingView={() => {
						setCurrentSetupStep(2);
					}}
				/>
			);
		}

		if (currentSetupStep === 4) {
			return (
				<AddBuildingTokenLiquidityForm
					buildingAddress={selectedBuildingAddress as `0x${string}`}
					onGetDeployBuildingTokenView={() => {
						setCurrentSetupStep(3);
					}}
				/>
			);
		}
	}, [currentSetupStep, selectedBuildingAddress, deployedMetadataIPFS]);

	return (
		<div className="p-6 max-w-7xl mx-auto space-y-6">
			<AdminInfoPanel />

			<div className="flex flex-col md:flex-row gap-6">
				<div className="flex-1">{renderSetupStepView}</div>
			</div>
		</div>
	);
}
