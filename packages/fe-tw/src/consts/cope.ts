export type ConstructionInfo = {
  materials?: string;
  yearBuilt?: string;
  roofType?: string;
  numFloors?: string;
};

export type OccupancyInfo = {
  type?: string;
  percentageOccupied?: string;
};

export type ProtectionInfo = {
  fire?: string;
  sprinklers?: string;
  security?: string;
};

export type ExposureInfo = {
  nearbyRisks?: string;
  floodZone?: string;
};

export type CopeData = {
  construction?: ConstructionInfo;
  occupancy?: OccupancyInfo;
  protection?: ProtectionInfo;
  exposure?: ExposureInfo;

  insuranceProvider?: string;
  coverageAmount?: string;
  coverageStart?: string;
  coverageEnd?: string;
  notes?: string;
};

export const copeIpfsData: Record<string, CopeData> = {
  "QmMockCopeHashFor1234": {
    construction: {
      materials: "Concrete & Steel",
      yearBuilt: "2015",
      roofType: "Flat",
      numFloors: "10",
    },
    occupancy: {
      type: "Residential/Commercial Mix",
      percentageOccupied: "85",
    },
    protection: {
      fire: "On-site fire extinguishers and alarms",
      sprinklers: "Partial coverage in common areas",
      security: "24/7 security guard and CCTV",
    },
    exposure: {
      nearbyRisks: "Adjacent to industrial facility",
      floodZone: "Zone B",
    },
    insuranceProvider: "Acme Insure",
    coverageAmount: "$1,000,000",
    coverageStart: "2024-01-01",
    coverageEnd: "2025-01-01",
    notes: "Initial coverage setup. Assess expansions for floors 8-10.",
  },
};