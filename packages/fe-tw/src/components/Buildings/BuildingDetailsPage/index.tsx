import type { BuildingData } from "@/types/erc3643/types";
import { BuildingBaseInfo } from "./BuildingBaseInfo";
import { BuildingDetailInfo } from "./BuildingDetailInfo";
import { BuildingSlices } from "./BuildingSlices";
import { BuildingVotes } from "./BuildingVotes";
import { useBuildingDetails } from "@/hooks/useBuildingDetails";
import { DeployTreasuryAndGovernanceForm } from "@/components/Admin/DeployTreasuryAndGovernanceForm";

export const BuildingDetailPage = (props: BuildingData) => {
	const { deployedBuildingTokens } = useBuildingDetails(
		props?.address as `0x${string}`,
	);

	return (
		<div>
			<BuildingBaseInfo {...props} />
			<BuildingDetailInfo {...props.info} />
			{props.voteItems?.length > 0 && (
				<BuildingVotes votes={props.voteItems} />
			)}
			{props.partOfSlices?.length > 0 && (
				<BuildingSlices slices={props.partOfSlices} />
			)}
			<DeployTreasuryAndGovernanceForm
				buildingAddress={props.address}
				buildingTokenAddress={deployedBuildingTokens[0]?.tokenAddress}
			/>
		</div>
	);
};
