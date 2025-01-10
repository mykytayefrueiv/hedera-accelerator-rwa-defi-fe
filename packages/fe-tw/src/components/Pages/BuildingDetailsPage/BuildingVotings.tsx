"use client";

import { BuildingVoteItem } from "./BuildingVoteItem";

export const BuildingVotings = ({ votings }: { votings: number[] }) => {
  return (
    <div className="flex flex-col mt-10">
      <article className="prose mb-6">
        <h2>Voting Items</h2>
      </article>

      <div className="flex flex-col gap-4">
        {votings?.map((vote) => (
          <BuildingVoteItem key={vote} voteId={vote} />
        ))}
      </div>
    </div>
  );
};
