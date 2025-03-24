export type SwapType = 'uniswap' | 'one_sided';

type Props = {
    swapTypeForm: SwapType,
    onSwapTabChange: (newType: SwapType) => void,
};

export const TradeFormTypeTabs = (props: Props) => {
    return (
        <div className="menu menu-vertical lg:menu-horizontal bg-purple-200 rounded-box">
          <a
            className={`tab${props.swapTypeForm === 'uniswap' ? ' tab-active' : ''}`}
            onClick={() => props.onSwapTabChange('uniswap')}
          >Uniswap Trade</a>
          <a
            className={`tab${props.swapTypeForm === 'one_sided' ? ' tab-active' : ''}`}
            onClick={() => props.onSwapTabChange('one_sided')}
          >One Sided Trade</a>
        </div>
      );
};
