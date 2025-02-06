"use client";

import { AdminInfoPanel } from "./AdminInfoPanel";
import { AddBuildingForm } from "./AddBuildingForm";
import { AddLiquidityForm as AddTokensLiquidityForm } from "./AddLiquidityForm";
import { DeployBuildingERC3643TokenForm } from "./DeployBuildingERC3643TokenForm";
import { useState, useMemo } from "react";

export function BuildingManagementView() {
  const [currentSetupStep, setCurrentSetupStep] = useState(1);
  const [deployedBuilding, setDeployedBuilding] = useState<`0x${string}`>();

  const renderSetupStepView = useMemo(() => {
    if (currentSetupStep === 1) {
      return (
        <AddBuildingForm onBuildingDeployed={({ address }) => {
          setCurrentSetupStep(2);
          setDeployedBuilding(address);
        }} />
      )
    } else if (currentSetupStep === 2) {
      return (
        <DeployBuildingERC3643TokenForm
          buildingAddress={deployedBuilding as `0x${string}`}
          onGetLiquidityView={() => {
            setCurrentSetupStep(3);
          }}
          onGetDeployBuildingView={() => {
            setCurrentSetupStep(1);
          }}
        />
      )
    } else if (currentSetupStep === 3) {
      return (
        <AddTokensLiquidityForm
          buildingAddress={deployedBuilding as `0x${string}`}
          onGetDeployBuildingTokenView={() => {
            setCurrentSetupStep(2);
          }}
        />
      )
    }
  }, [currentSetupStep])

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <AdminInfoPanel />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          {renderSetupStepView}
        </div>
      </div>
    </div>
  );
}
