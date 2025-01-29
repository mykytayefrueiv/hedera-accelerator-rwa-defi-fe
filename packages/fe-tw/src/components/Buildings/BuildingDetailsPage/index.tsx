"use client";

import { BuildingData } from "@/types/erc3643/types";
import { BuildingDetailInfo } from "./BuildingDetailInfo";
import { BuildingBaseInfo } from "./BuildingBaseInfo";
import { BuildingSlices } from "./BuildingSlices";
import { BuildingVotings } from "./BuildingVotings";

export const BuildingDetailPage = (props: BuildingData) => {
  return (
    <div>
      <BuildingBaseInfo {...props} />
      <BuildingDetailInfo {...props.info} />
      {props.votingItems.length > 0 && <BuildingVotings votings={props.votingItems} />}
      {props.partOfSlices.length > 0 && <BuildingSlices slices={props.partOfSlices} />}
    </div>
  );
};
