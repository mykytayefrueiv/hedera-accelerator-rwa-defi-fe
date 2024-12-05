import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar"
import { BuildingData } from "@/types/erc3643/types";
import { BuildingDetailInfo } from "./BuildingDetailInfo";
import moment from 'moment'

type Props = BuildingData;

export const BuildingDetailPage = ({
    title,
    purchasedAt,
    description,
    info,
    imageUrl,
    /*
        votingItems,
        partOfSlices,
    */
}: Props) => {
    return (
        <div className="flex flex-col p-10">
            <div className="flex flex-row">
                <ReusableAvatar size="extra-lg" imageSource={imageUrl ?? '/assets/dome.jpeg'} imageAlt={title} isRounded isFocusAvailable={false} />
                <div className="flex flex-col ml-20">
                    <article className="prose">
                        <h1>{title}</h1>
                        <p className="text-sm">Purchased at: {moment(purchasedAt).format('YYYY-MM-DD')}</p>
                    </article>
                    <article className="mt-4">
                        {description.split('\\').map(line => (
                            <p className="mt-2" key={line}>{line}</p>
                        ))}
                    </article>
                </div>
            </div>
            <BuildingDetailInfo {...info} />
        </div>
    );
};
