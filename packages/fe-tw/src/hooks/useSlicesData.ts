import { watchContractEvent } from '@/services/contracts/watchContractEvent';
import { sliceFactoryAbi } from '@/services/contracts/abi/sliceFactoryAbi';
import { sliceFactoryAddress } from "@/services/contracts/addresses";
import { useEffect, useState } from 'react';
import { QueryData, SliceData } from '@/types/erc3643/types';

export const usdcAddress = "0x0000000000000000000000000000000000001549";
export const uniswapRouterAddress = "0xACE99ADFd95015dDB33ef19DCE44fee613DB82C2";
export const pythOracleAddress = "0x330C40b17607572cf113973b8748fD1aEd742943";

// todo: Get rid of faked data, fetch real data from SC.
const sliceItemMock = (address: string) => ({
  imageUrl: "https://ca-times.brightspotcdn.com/dims4/default/ba0c5a1/2147483647/strip/true/crop/7872x5247+95+0/resize/2000x1333!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2F63%2F4d%2F265a177543e6a76e7559aa0e5210%2F1243075903.jpg",
  name: "Stadiums",
  description: "Premier stadium developments supporting sports and large-scale events.",
  estimatedPrice: 70,
  timeToEnd: 1500000,
  allocation: 25,
  id: address,
  address,
});

export function useSlicesData() {
  const [slicesAddresses, setSlicesAddresses] = useState<string[]>([]);
  const [slices, setSlices] = useState<SliceData[]>([]);

  watchContractEvent({
    address: sliceFactoryAddress,
    abi: sliceFactoryAbi,
    eventName: "SliceDeployed",
    onLogs: (data) => {
      setSlicesAddresses(prev => (prev.includes((data[0] as unknown as QueryData<string[]>).args[0]) ?
        prev :
        [...prev, (data[0] as unknown as QueryData<string[]>).args[0]]
      ))
    },
  });

  const requestSlicesMetadata = async () => {
    const slicesMetadata = await Promise.all(slicesAddresses.map(address => sliceItemMock(address)));

    setSlices(slicesMetadata);
  };

  useEffect(() => {
    if (slicesAddresses?.length) {
      requestSlicesMetadata();
    }
  }, [slicesAddresses]);

  return {
    slicesAddresses,
    slices,
  };
}
