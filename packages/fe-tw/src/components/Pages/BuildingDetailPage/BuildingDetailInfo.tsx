import { BuildingInfo } from "@/types/erc3643/types";

export const BuildingDetailInfo = (props: BuildingInfo) => {
    const { demographics, financial } = props;

    return (
        <div className="flex flex-row md:justify-between max-w-screen-sm mt-10">
            <div>
                <article className="prose">
                    <h3>Financial</h3>
                </article>
                <p>Percentage owned by overall property: {financial.percentageOwned}</p>
                <p>Token price: {financial.directExposure}</p>
                <p>Exposure: {financial.exposure}</p>
                <p>Token price: {financial.tokenPrice}</p>
                <p>Yield: {financial.yield[0].percentage} {financial.yield[0].days}</p>
            </div>
            <div>
                <article className="prose">
                    <h3>Demographics</h3>
                </article>
                <p>Constructed: {demographics.constructedYear}</p>
                <p>Type: {demographics.type}</p>
                <p>Location: {demographics.location}</p>
                <p>Location Type: {demographics.locationType}</p>
            </div>
        </div>
    );
};
