"use client";

import { DeployBuilding } from "@/components/Account/DeployBuilding";
import {
  DeployBuildingBasicMetadata,
  type NewBuildingFormProps,
} from "@/components/Account/DeployBuildingBasicMetadata";
import { DeployBuildingCopeMetadata } from "@/components/Account/DeployBuildingCopeMetadata";
import { useWallet } from "@buidlerlabs/hashgraph-react-wallets";
import {
  HashpackConnector,
  MetamaskConnector,
} from "@buidlerlabs/hashgraph-react-wallets/connectors";
import React, { useMemo, useState } from "react";
import { BuildingManagementViewBreadcrumbs } from "../Page/BuildingManagementViewBreadcrumbs";
import { AddBuildingTokenLiquidityForm } from "./AddBuildingTokenLiquidityForm";
import { AdminInfoPanel } from "./AdminInfoPanel";
import { DeployBuildingERC3643TokenForm } from "./DeployBuildingERC3643TokenForm";
import { DeployBuildingVaultCompounderForm } from "./DeployBuildingVaultCompounderForm";
import { DeployTreasuryAndGovernanceForm } from "./DeployTreasuryAndGovernanceForm";
import { useBuildingDetails } from "@/hooks/useBuildingDetails";

export function BuildingManagementView() {
  const { isConnected: isConnectedHashpack } =
    useWallet(HashpackConnector) || {};

  const { isConnected: isConnectedMetamask } =
    useWallet(MetamaskConnector) || {};

  const [currentSetupStep, setCurrentSetupStep] = useState(1);

  const [basicData, setBasicData] = useState<NewBuildingFormProps | null>(null);
  const [deployedMetadataIPFS, setDeployedMetadataIPFS] = useState("");
  const [selectedBuildingAddress, setSelectedBuildingAddress] =
    useState<`0x${string}`>();
  const { deployedBuildingTokens } = useBuildingDetails(selectedBuildingAddress);

  const renderSetupStepView = useMemo(() => {
    if (currentSetupStep === 1) {
      return (
        <DeployBuildingBasicMetadata
          onBasicMetadataComplete={(data) => {
            setBasicData(data);
            setCurrentSetupStep(2);
          }}
          setDeployStep={setCurrentSetupStep}
        />
      );
    }

    if (currentSetupStep === 2) {
      if (!basicData) {
        return <p>Error: missing basic data from step 1</p>;
      }
      return (
        <DeployBuildingCopeMetadata
          basicData={basicData}
          onCopeDeployed={(ipfsHash) => {
            setDeployedMetadataIPFS(ipfsHash);
            setCurrentSetupStep(3);
          }}
          onBack={() => setCurrentSetupStep(1)}
        />
      );
    }

    if (currentSetupStep === 3) {
      return (
        <DeployBuilding
          deployedMetadataIPFS={deployedMetadataIPFS}
          onBuildingDeployed={() => {
            setCurrentSetupStep(4);
          }}
        />
      );
    }

    if (currentSetupStep === 4) {
      return (
        <DeployBuildingERC3643TokenForm
          onGetNextStep={() => {
            setCurrentSetupStep(5);
          }}
          onGetPrevStep={() => {
            setCurrentSetupStep(3);
          }}
          setSelectedBuildingAddress={(address) => {
            setSelectedBuildingAddress(address);
          }}
          buildingAddress={selectedBuildingAddress}
        />
      );
    }

    if (currentSetupStep === 5) {
      return (
        <DeployTreasuryAndGovernanceForm
          buildingAddress={selectedBuildingAddress}
          onGetNextStep={() => {
            setCurrentSetupStep(6);
          }}
        />
      );
    }

    if (currentSetupStep === 6) {
      return (
        <AddBuildingTokenLiquidityForm
          buildingAddress={selectedBuildingAddress}
          onGetPrevStep={() => {
            setCurrentSetupStep(5);
          }}
          onGetNextStep={() => {
            setCurrentSetupStep(7);
          }}
        />
      );
    }

    if (currentSetupStep === 7) {
      return <DeployBuildingVaultCompounderForm />;
    }
  }, [
    currentSetupStep,
    basicData,
    deployedMetadataIPFS,
    selectedBuildingAddress,
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <BuildingManagementViewBreadcrumbs
        onGetDeployAToken={() => {
          setCurrentSetupStep(6);
        }}
        onGetDeployBuilding={() => {
          setCurrentSetupStep(1);
        }}
        onGetDeployERC3643Token={() => {
          setCurrentSetupStep(4);
        }}
        onGetDeployGovernance={() => {
          setCurrentSetupStep(7);
        }}
        activeStepOn={currentSetupStep}
      />
      <AdminInfoPanel />
      <div className="flex flex-col md:flex-row gap-6">
        {isConnectedHashpack || isConnectedMetamask ? (
          <div className="flex-1">{renderSetupStepView}</div>
        ) : (
          <div className="flex-1 text-gray-700">Please connect wallet</div>
        )}
      </div>
    </div>
  );
}
