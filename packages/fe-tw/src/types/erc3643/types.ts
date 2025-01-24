import type { AvatarSize } from "@/components/Avatars/ReusableAvatar";
import type { EvmAddress } from "@/types/common";

export type DeployTokenRequest = {
	name: string;
	symbol: string;
	decimals: number;
	complianceModules: EvmAddress[];
	complianceSettings: EvmAddress[];
};

export type SliceData = {
	imageUrl?: string;
	name: string;
	id: string;
	timeToEnd?: number;
	description?: string;
	allocation?: number;
	estimatedPrice?: number;
}

export type BuildingSliceCategoryData = {
	id: number;
	name: string;
	title: string;
	itemsSize?: AvatarSize;
	items?: SliceData[];
}

type BulidingYield = {
	percentage: number;
	days: number;
}

export type BuildingInfo = {
	financial: {
		percentageOwned: number,
		tokenPrice: number;
		directExposure: number;
		yield: BulidingYield[];
		treasury: number;
	},
	demographics: {
		constructedYear: number;
		type: string;
		location: string;
		locationType: string;
	};
}

export type BuildingData = {
	id: number;
	title: string;
	purchasedAt: number;
	description: string;
	info: BuildingInfo;
	votingItems: number[];
	partOfSlices: string[];
	imageUrl?: string;
	allocation: number;
	copeIpfsHash?: string;
}

export type VotingItem = {
	id: number;
	title: string;
	description: string;
	startDate: string;
	endDate: string;
	userHasVoted: boolean;
};

export type QueryData<ArgType> = {
	args: ArgType;
};
