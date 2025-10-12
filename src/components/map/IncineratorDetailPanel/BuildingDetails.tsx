"use client";

import { t } from "@/utils/translations";
import type { Incinerator } from "@/types/incinerator";

type Building = NonNullable<Incinerator["buildings"]>[number];

/**
 * Props for the BuildingDetails component.
 */
interface BuildingDetailsProps {
  /** An array of buildings associated with the incinerator. Can be null or undefined. */
  buildings: Incinerator["buildings"];
}

/**
 * A card component that displays details for a single building.
 * @param {object} props - The props for the component.
 * @param {Building} props.building - The building object to display.
 */
const BuildingCard = ({ building }: { building: Building }) => {
  if (!building.details) return null;

  return (
    <div className="rounded-lg border p-3">
      <h5 className="mb-2 font-semibold">
        {building.name ||
          t("incineratorDetails.buildingNameAndId").replace(
            "{id}",
            String(building.id),
          )}
      </h5>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>{t("incineratorDetails.buildingFunction")}:</span>
          <span className="font-medium">{building.details.function}</span>
        </div>
        <div className="flex justify-between">
          <span>{t("incineratorDetails.buildingBuilt")}:</span>
          <span className="font-medium">{building.details.yearBuilt}</span>
        </div>
        <div className="flex justify-between">
          <span>{t("incineratorDetails.buildingArea")}:</span>
          <span className="font-medium">{building.details.areaInSqMeters}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * A component that displays a list of building details associated with an incinerator.
 * It only renders if there are buildings with details available.
 * @param {BuildingDetailsProps} props - The props for the component.
 */
const BuildingDetails = ({ buildings }: BuildingDetailsProps) => {
  const buildingsWithDetails = buildings?.filter((b) => b.details);

  if (!buildingsWithDetails || buildingsWithDetails.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg bg-[var(--background-muted)] p-3">
      <h4 className="mb-2 font-semibold">
        {t("incineratorDetails.buildingsTitle")}
      </h4>
      <div className="space-y-3">
        {buildingsWithDetails.map((building) => (
          <BuildingCard key={building.id} building={building} />
        ))}
      </div>
    </div>
  );
};

export default BuildingDetails;
