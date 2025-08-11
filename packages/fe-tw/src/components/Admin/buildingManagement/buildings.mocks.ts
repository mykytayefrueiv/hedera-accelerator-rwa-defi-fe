import { BuildingFormProps } from "./types";
import { USDC_ADDRESS } from "@/services/contracts/addresses";

export type BuildingMock = {
   title: string;
   description: string;
   purchaseDate: string; // YYYY-MM-DD
   constructedYear: string; // YYYY
   type: string;
   location: string;
   locationType: string;
   tokenSupply: number;
   imageCid: string;
   cope?: {
      constructionMaterials?: string;
      constructionRoofType?: string;
      constructionNumFloors?: string;
      occupancyType?: string;
      occupancyPercentage?: string;
      protectionFire?: string;
      protectionSprinklers?: string;
      protectionSecurity?: string;
      exposureNearbyRisks?: string;
      exposureFloodZone?: string;
      constructionYearBuilt?: string;
   };
};

const IMAGE_CIDS = [
   "bafybeibhmtcpbts3mzfdhfipsrfbjmhcneaivincxv2fkm6bwm6to6ze7m",
   "bafkreiayqy3q7wy3sy4k6f2ogotn6pv7eisy3uxg7hvbbdhzt7kaditium",
   "bafybeidj73vcenzlprq4nnrjdfnpyit6mie3q4gaol2yajjnz7et3vjkhe",
   "bafybeigyqbd5fivd24r72mqgnffcfplysiemolvr3hr756qqqkkkhuf3fq",
   "bafybeiefu6neyvnrmy7ip2wgz6fbc2pqw7s6wqgnckd2wlldkm4i4bfatm",
];

const pickCid = (i: number) => IMAGE_CIDS[i % IMAGE_CIDS.length];

export const BUILDING_MOCKS: BuildingMock[] = [
   {
      title: "Skyline Tower",
      description: "Modern residential high-rise with panoramic city views.",
      purchaseDate: "2022-03-15",
      constructedYear: "2018",
      type: "Residential High-Rise",
      location: "Long Island City, NY, USA",
      locationType: "Urban",
      tokenSupply: 1_000_000,
      imageCid: pickCid(0),
      cope: {
         constructionMaterials: "Reinforced concrete & glass curtain wall",
         constructionRoofType: "Flat membrane",
         constructionNumFloors: "67",
         occupancyType: "Residential",
         occupancyPercentage: "92",
         protectionFire: "NFPA-compliant systems",
         protectionSprinklers: "Wet pipe",
         protectionSecurity: "24/7 concierge & CCTV",
         exposureNearbyRisks: "Low",
         exposureFloodZone: "Zone X",
         constructionYearBuilt: "2018",
      },
   },
   {
      title: "Harbor Point Offices",
      description: "Class A office complex overlooking the marina.",
      purchaseDate: "2021-11-02",
      constructedYear: "2012",
      type: "Office",
      location: "San Diego, CA, USA",
      locationType: "Waterfront Urban",
      tokenSupply: 850_000,
      imageCid: pickCid(1),
      cope: {
         constructionMaterials: "Steel frame & curtain wall",
         constructionRoofType: "Green roof sections",
         constructionNumFloors: "15",
         occupancyType: "Office",
         occupancyPercentage: "88",
         protectionFire: "Sprinklers & standpipes",
         protectionSprinklers: "Wet pipe",
         protectionSecurity: "Keycard access, patrol",
         exposureNearbyRisks: "Marina fuel storage",
         exposureFloodZone: "Zone AE",
         constructionYearBuilt: "2012",
      },
   },
   {
      title: "Maple Grove Residences",
      description: "Suburban garden-style apartment community.",
      purchaseDate: "2020-07-20",
      constructedYear: "2005",
      type: "Multifamily",
      location: "Naperville, IL, USA",
      locationType: "Suburban",
      tokenSupply: 600_000,
      imageCid: pickCid(2),
      cope: {
         constructionMaterials: "Wood frame with brick veneer",
         constructionRoofType: "Asphalt shingle",
         constructionNumFloors: "3",
         occupancyType: "Residential",
         occupancyPercentage: "94",
         protectionFire: "Hydrants & smoke alarms",
         protectionSprinklers: "Partial",
         protectionSecurity: "Gated entry",
         exposureNearbyRisks: "Nearby rail line",
         exposureFloodZone: "Zone X",
         constructionYearBuilt: "2005",
      },
   },
   {
      title: "Techyard Campus",
      description: "Flexible tech office campus with collaborative spaces.",
      purchaseDate: "2023-01-30",
      constructedYear: "2016",
      type: "Office Campus",
      location: "Austin, TX, USA",
      locationType: "Urban Fringe",
      tokenSupply: 1_200_000,
      imageCid: pickCid(3),
      cope: {
         constructionMaterials: "Steel & precast panels",
         constructionRoofType: "Cool roof",
         constructionNumFloors: "6",
         occupancyType: "Office",
         occupancyPercentage: "81",
         protectionFire: "Sprinklers, alarm",
         protectionSprinklers: "Wet pipe",
         protectionSecurity: "On-site security",
         exposureNearbyRisks: "Adjacent highway",
         exposureFloodZone: "Zone X",
         constructionYearBuilt: "2016",
      },
   },
   {
      title: "Riverside Lofts",
      description: "Converted warehouse lofts with riverfront access.",
      purchaseDate: "2019-06-10",
      constructedYear: "1928",
      type: "Residential Lofts",
      location: "Portland, OR, USA",
      locationType: "Urban Waterfront",
      tokenSupply: 500_000,
      imageCid: pickCid(4),
      cope: {
         constructionMaterials: "Brick & heavy timber",
         constructionRoofType: "Built-up",
         constructionNumFloors: "5",
         occupancyType: "Residential",
         occupancyPercentage: "96",
         protectionFire: "Updated systems",
         protectionSprinklers: "Dry pipe",
         protectionSecurity: "Secured entries",
         exposureNearbyRisks: "River flood risk",
         exposureFloodZone: "Zone AE",
         constructionYearBuilt: "1928",
      },
   },
   {
      title: "Aurora Business Center",
      description: "Mid-rise office with efficient floor plates.",
      purchaseDate: "2022-09-12",
      constructedYear: "2009",
      type: "Office",
      location: "Denver, CO, USA",
      locationType: "Urban",
      tokenSupply: 700_000,
      imageCid: pickCid(0),
   },
   {
      title: "Sunset Retail Plaza",
      description: "Grocery-anchored neighborhood retail center.",
      purchaseDate: "2021-04-05",
      constructedYear: "2010",
      type: "Retail",
      location: "Phoenix, AZ, USA",
      locationType: "Suburban",
      tokenSupply: 450_000,
      imageCid: pickCid(1),
   },
   {
      title: "Lakeside Corporate Park",
      description: "Business park with lake views and amenities.",
      purchaseDate: "2018-10-18",
      constructedYear: "2007",
      type: "Office Park",
      location: "Minneapolis, MN, USA",
      locationType: "Suburban",
      tokenSupply: 650_000,
      imageCid: pickCid(2),
   },
   {
      title: "Seaport Innovation Hub",
      description: "Creative office in revitalized seaport district.",
      purchaseDate: "2020-05-22",
      constructedYear: "2014",
      type: "Creative Office",
      location: "Boston, MA, USA",
      locationType: "Urban Waterfront",
      tokenSupply: 900_000,
      imageCid: pickCid(3),
   },
   {
      title: "Garden Court Apartments",
      description: "Family-friendly apartments with courtyard.",
      purchaseDate: "2019-02-14",
      constructedYear: "2001",
      type: "Multifamily",
      location: "Sacramento, CA, USA",
      locationType: "Suburban",
      tokenSupply: 520_000,
      imageCid: pickCid(4),
   },
   {
      title: "Cedar Ridge Townhomes",
      description: "Townhome community near top schools.",
      purchaseDate: "2017-08-09",
      constructedYear: "2003",
      type: "Residential",
      location: "Raleigh, NC, USA",
      locationType: "Suburban",
      tokenSupply: 480_000,
      imageCid: pickCid(0),
   },
   {
      title: "Metro Central Tower",
      description: "Transit-oriented mixed-use tower.",
      purchaseDate: "2023-03-28",
      constructedYear: "2019",
      type: "Mixed-Use",
      location: "Seattle, WA, USA",
      locationType: "Urban",
      tokenSupply: 1_300_000,
      imageCid: pickCid(1),
   },
   {
      title: "Broadway Creative Lofts",
      description: "Loft-style offices for media and design firms.",
      purchaseDate: "2021-01-19",
      constructedYear: "1936",
      type: "Creative Office",
      location: "Los Angeles, CA, USA",
      locationType: "Urban",
      tokenSupply: 780_000,
      imageCid: pickCid(2),
   },
   {
      title: "Hillside Medical Pavilion",
      description: "Outpatient medical facility with modern suites.",
      purchaseDate: "2020-12-03",
      constructedYear: "2011",
      type: "Medical Office",
      location: "Pittsburgh, PA, USA",
      locationType: "Urban",
      tokenSupply: 560_000,
      imageCid: pickCid(3),
   },
   {
      title: "Capital City Center",
      description: "CBD office tower near civic landmarks.",
      purchaseDate: "2018-04-17",
      constructedYear: "2008",
      type: "Office",
      location: "Atlanta, GA, USA",
      locationType: "Urban",
      tokenSupply: 1_100_000,
      imageCid: pickCid(4),
   },
   {
      title: "Greenfield Logistics Park",
      description: "Modern logistics park with cross-dock facilities.",
      purchaseDate: "2022-06-21",
      constructedYear: "2015",
      type: "Industrial",
      location: "Columbus, OH, USA",
      locationType: "Industrial",
      tokenSupply: 1_500_000,
      imageCid: pickCid(0),
   },
   {
      title: "Bayview Condominiums",
      description: "Condo tower with waterfront amenities.",
      purchaseDate: "2019-09-07",
      constructedYear: "2013",
      type: "Condominium",
      location: "Miami, FL, USA",
      locationType: "Urban Waterfront",
      tokenSupply: 730_000,
      imageCid: pickCid(1),
   },
   {
      title: "Old Mill Offices",
      description: "Historic mill converted to boutique offices.",
      purchaseDate: "2017-05-11",
      constructedYear: "1910",
      type: "Office",
      location: "Providence, RI, USA",
      locationType: "Urban",
      tokenSupply: 420_000,
      imageCid: pickCid(2),
   },
   {
      title: "Summit Ridge Resort",
      description: "Four-season mountain resort with hospitality.",
      purchaseDate: "2021-02-26",
      constructedYear: "2006",
      type: "Hospitality",
      location: "Park City, UT, USA",
      locationType: "Mountain",
      tokenSupply: 980_000,
      imageCid: pickCid(3),
   },
   {
      title: "Canal Side Flats",
      description: "Urban apartments along historic canal.",
      purchaseDate: "2020-08-30",
      constructedYear: "2009",
      type: "Multifamily",
      location: "Indianapolis, IN, USA",
      locationType: "Urban",
      tokenSupply: 610_000,
      imageCid: pickCid(4),
   },
];

const toSymbol = (title: string) => {
   const letters = title
      .replace(/[^A-Za-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("");
   const s = (letters || title.replace(/[^A-Za-z0-9]/g, "").toUpperCase()).slice(0, 4);
   return s.length >= 2 ? s : title.slice(0, 3).toUpperCase() || "BLD";
};

export const makePrefilledFormFromMock = (mock: BuildingMock): BuildingFormProps => {
   const symbol = toSymbol(mock.title);
   const autoSymbol = `A${symbol}`;
   const shareSymbol = `S${symbol}`;

   const zero = "0x0000000000000000000000000000000000000000";
   const mint = Math.max(1, Math.floor(mock.tokenSupply * 0.1));

   return {
      info: {
         buildingTitle: mock.title,
         buildingDescription: mock.description,
         buildingPurchaseDate: mock.purchaseDate,
         buildingImageIpfsId: mock.imageCid,
         buildingImageIpfsFile: undefined,
         buildingConstructedYear: mock.constructedYear,
         buildingType: mock.type,
         buildingLocation: mock.location,
         buildingLocationType: mock.locationType,
         buildingTokenSupply: mock.tokenSupply,
         copeConstructionMaterials: mock.cope?.constructionMaterials ?? "",
         copeConstructionYearBuilt: mock.cope?.constructionYearBuilt ?? mock.constructedYear,
         copeConstructionRoofType: mock.cope?.constructionRoofType ?? "",
         copeConstructionNumFloors: mock.cope?.constructionNumFloors ?? "",
         copeOccupancyType: mock.cope?.occupancyType ?? "",
         copeOccupancyPercentage: mock.cope?.occupancyPercentage ?? "",
         copeProtectionFire: mock.cope?.protectionFire ?? "",
         copeProtectionSprinklers: mock.cope?.protectionSprinklers ?? "",
         copeProtectionSecurity: mock.cope?.protectionSecurity ?? "",
         copeExposureNearbyRisks: mock.cope?.exposureNearbyRisks ?? "",
         copeExposureFloodZone: mock.cope?.exposureFloodZone ?? "",
      },
      token: {
         tokenName: `${mock.title} Token`,
         tokenSymbol: symbol,
         tokenDecimals: 18,
         buildingTokenAmount: 0,
         mintBuildingTokenAmount: mint,
         tokenBAddress: USDC_ADDRESS,
         tokenBAmount: 0,
      },
      treasuryAndGovernance: {
         reserve: 10,
         npercentage: 20,
         governanceName: `${mock.title} Governance`,
         shareTokenName: `${mock.title} Shares`,
         shareTokenSymbol: shareSymbol,
         feeReceiverAddress: zero,
         feeToken: zero,
         feePercentage: 0,
         autoCompounderTokenName: `${mock.title} Auto-Compounder`,
         autoCompounderTokenSymbol: autoSymbol,
      },
   };
};
