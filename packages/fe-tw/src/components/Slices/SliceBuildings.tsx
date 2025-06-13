import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
} from "@/components/ui/carousel";
import { BuildingNFTData } from "@/types/erc3643/types";
import { Card, CardContent } from "../ui/card";
import { isValidIPFSImageUrl } from "@/utils/helpers";
import { useRouter } from "next/navigation";

export const SliceBuildings = ({ buildingsData }: { buildingsData: BuildingNFTData[] }) => {
    const router = useRouter();
    
    return (
        <div>
            <div className="flex justify-between items-center mb-2 mt-15">
               <h1 className="text-2xl font-bold">Buildings List</h1>
            </div>
            
            <Carousel>
                <CarouselContent className="p-4">
                    {buildingsData.map((bld) => (
                        <CarouselItem
                            onClick={() => {
                                router.push(`/building/${bld.address}`);
                            }}
                            key={bld.name}
                            className="hover:scale-105 hover:bg-accent-focus transition-all duration-300 basis-1/4"
                        >
                            <Card>
                                <CardContent>
                                    <img
                                        src={isValidIPFSImageUrl(bld.image) ? bld.image : "assets/dome.jpeg"}
                                        alt={bld.name}
                                        className="rounded-md object-cover w-full h-40 mb-2"
                                    />
                                    <span className="text-2xl sm:text-3xl font-bold">{bld.name}</span>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
};
