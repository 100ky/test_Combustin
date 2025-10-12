/**
 * Type definition for the detailed properties of a building.
 */
export interface BuildingDetails {
  yearBuilt: number;
  areaInSqMeters: number;
  function: string;
}

/**
 * Type definition for a building within an incinerator facility.
 */
export interface Building {
  id: number;
  name: string | null;
  type: string;
  description: string | null;
  geometry: unknown;
  details: BuildingDetails | null;
  incineratorId: number | null;
}

/**
 * Type definition for an incinerator (waste-to-energy plant) used in the project.
 */
export interface Incinerator {
  id: number;
  name: string | null;
  location: {
    lat: number;
    lng: number;
  };
  streetAddress: string | null;
  description: string | null;
  capacity: number | null;
  operational: boolean;
  yearEstablished: number;
  propertyBoundary: unknown;
  buildings: Building[];
}
