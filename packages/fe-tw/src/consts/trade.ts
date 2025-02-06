export type TradeState = {
  usdcBalance: number;
  buildingTokenBalances: Record<number, number>; // buildingId -> token balance
};

export const tradeState: TradeState = {
  usdcBalance: 1000,
  buildingTokenBalances: {
    // just random
    1234: 100,
    5678: 50,
    9101: 200,
    1121: 0,
    3344: 75,
    5566: 150,
    7777: 80,
    8888: 30,
    9999: 60,
    1112: 40,
    2223: 20,
  },
};

export const ONE_ERC2O_TOKEN_18decimals = 1000000000000000000n;

export const DEFAULT_ERC20_DECIMALS = 18;
