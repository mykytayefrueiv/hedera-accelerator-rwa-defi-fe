import { watchContractEvent } from '@/services/contracts/watchContractEvent';
import { sliceFactoryAbi } from '@/services/contracts/abi/sliceFactoryAbi';
import { SLICE_FACTORY_ADDRESS } from "@/services/contracts/addresses";
import { useEffect, useState } from 'react';
import { QueryData, SliceData } from '@/types/erc3643/types';

// todo: update with call to ipfs
const sliceItemMock = (address: `0x${string}`) => ({
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
  const [sliceAddresses, setSliceAddresses] = useState<`0x${string}`[]>([]);
  const [slices, setSlices] = useState<SliceData[]>([]);
  const [sliceLogs, setSliceLogs] = useState<any[]>([]);

  useEffect(() => {
    watchContractEvent({
      address: SLICE_FACTORY_ADDRESS,
      abi: sliceFactoryAbi,
      eventName: "SliceDeployed",
      onLogs: (data) => {
        setSliceLogs(data.map(log => (log as unknown as QueryData<string[]>).args[0]));
      },
    });
  }, [setSliceLogs]);

  const requestSlicesDetails = async () => {
    const slicesMetadata = await Promise.all(sliceAddresses.map(address => sliceItemMock(address)));

    setSlices(slicesMetadata);
  };

  useEffect(() => {
    setSliceAddresses(sliceLogs);
  }, [sliceLogs?.length]);

  useEffect(() => {
    if (!slices.length) {
      requestSlicesDetails();
    }
  }, [sliceAddresses?.length]);

  return {
    sliceAddresses,
    slices,
  };
}
