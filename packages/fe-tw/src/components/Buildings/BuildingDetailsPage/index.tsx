import { BuildingData } from "@/types/erc3643/types";
import { BuildingDetailInfo } from "./BuildingDetailInfo";
import { BuildingBaseInfo } from "./BuildingBaseInfo";
import { BuildingSlices } from "./BuildingSlices";
import { BuildingVotes } from "./BuildingVotes";

export const BuildingDetailPage = (props: BuildingData) => {
  return (
    <div >
      <BuildingBaseInfo {...props} />
      <BuildingDetailInfo {...props.info} />
      {props.votingItems.length > 0 && <BuildingVotes votes={props.votingItems} />}
      {props.partOfSlices.length > 0 && <BuildingSlices slices={props.partOfSlices} />}
    </div>
  );
};
