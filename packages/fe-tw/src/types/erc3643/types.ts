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
		percentageOwned?: number,
		tokenPrice?: number;
		directExposure?: number;
		yield?: BulidingYield[];
		treasury?: number;
	},
	demographics: {
		constructedYear?: string | number;
		type?: string | number;
		size?: string | number;
		state?: string | number;
		location?: string | number;
		locationType?: string | number;
	};
}

export type BuildingData = {
	id: string;
	title: string;
	address: `0x${string}`;
	purchasedAt: number;
	description: string;
	info: BuildingInfo;
	votingItems: number[];
	partOfSlices: string[];
	imageUrl?: string;
	allocation: number;
	copeIpfsHash?: string;
}

export type BuildingNFT = {
	addr: string;
	tokenURI: string;
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

export type BuildingNFTAttribute = {
	display_type: string,
	trait_type: string,
	value: string | number
}

export type BuildingNFTData = {
	description: string;
	image: string;
	name: string;
	address: `0x${string}`;
	allocation: number;
	purchasedAt: number;
	attributes: BuildingNFTAttribute[];
	copeIpfsHash: string;
}

export type SwapTradeItem = {
	tokenA: string,
	tokenB: string,
	tokenAAmount: string,
	tokenBAmount: string,
	id?: string,
};

export type SwapLiquidityPair = {
	tokenA: `0x${string}`,
	tokenB: `0x${string}`,
};

export type SwapTokensRequestBody = {
	path: string[],
	amountIn: bigint,
	amountOut: bigint,
	deadline?: number,
};

export type SwapTokenPriceRequestBody = {
	isSell: boolean,
	token: `0x${string}`,
	amount: bigint,
	thresholdIntervalInSeconds: number,
}

export type SwapTokenAddLiquidityRequestBody = {
	tokenA: string,
	tokenB?: string,
	amount: bigint,
};

export type SwapTokenSwapRequestBody = {
	tokenA: string,
	tokenB: string,
	amount: bigint,
};

export type AddLiquidityRequestBody = {
	tokenA: string,
	tokenB: string,
	tokenAAmount: string,
	tokenBAmount: string,
}

export type SwapTradeProfit = {
	dailyProfitInUSD: number,
	weeklyProfitInUSD: number,
}
