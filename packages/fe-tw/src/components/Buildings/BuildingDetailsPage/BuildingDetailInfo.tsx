import { BuildingInfo } from "@/types/erc3643/types";

export const BuildingDetailInfo = (props: BuildingInfo) => {
  const { demographics, financial } = props;

  return (
    <div className="flex flex-col md:flex-row md:justify-between max-w-screen-sm mt-10 space-y-8 md:space-y-0 md:space-x-12">
      {/* Financial Section */}
      <div>
        <article className="prose">
          <h3 className="font-semibold text-slate-700">Financial</h3>
        </article>
        <p>Percentage Owned by overall property: {financial.percentageOwned}%</p>
        <p>Token price: {financial.tokenPrice}$</p>
        {!!financial.directExposure && !!financial.tokenPrice && (
          <p>
            Direct exposure: {financial.directExposure} ({financial.directExposure * financial.tokenPrice}$)
          </p>
        )}
        <p>
          Yield:{" "}
          {financial.yield?.map((_yield) => (
            <span key={_yield.percentage}>
              {"\n"} {_yield.percentage}% ({_yield.days} days)
            </span>
          ))}
        </p>
        {!!financial.treasury && !!financial.tokenPrice && (
          <p>
            Treasury: {financial.treasury} ({financial.treasury * financial.tokenPrice}$)
          </p>
        )}
      </div>

      <div>
        <article className="prose">
          <h3 className="font-semibold text-slate-700">Demographics</h3>
        </article>
        <p>Construction year: {demographics.constructedYear}</p>
        <p>Type: {demographics.type}</p>
        <p>Size: {demographics.size}</p>
        <p>Location: {demographics.location}</p>
        <p>Location Type: {demographics.locationType}</p>
      </div>
    </div>
  );
};
