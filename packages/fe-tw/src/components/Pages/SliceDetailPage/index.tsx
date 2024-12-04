import { ReusableAvatar } from "@/components/Avatars/ReusableAvatar"

type Props = {
    sliceId: string;
};

export const SliceDetailPage = ({ sliceId }: Props) => {
    const slice = {
        title: "Lorem ipsum odor amet",
        purchasedDate: Date.now(),
        description: "Lorem ipsum odor amet, consectetuer adipiscing elit",
    };

    return (
       <div className="flex flex-col p-10">
            <div className="flex flex-row">
                <ReusableAvatar size="lg" imageSource="/assets/dome.jpeg" imageAlt={sliceId} isRounded />
                <div className="flex flex-col ml-20">
                    <h2 className="font-semibold text-xl">{slice.title}</h2>
                    <span className="text-sm">Purchased at: {slice.purchasedDate}</span>
                    <p>{slice.description}</p>
                    <p className="mt-5">{slice.description}</p>
                </div>
            </div>
       </div>
    );
};
