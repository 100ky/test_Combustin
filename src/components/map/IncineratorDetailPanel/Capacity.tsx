"use client";

import { t } from "@/utils/translations";
import type { Incinerator } from "@/types/incinerator";

/**
 * Props for the Capacity component.
 */
interface CapacityProps {
  /** The capacity of the incinerator in tons per year. Can be null or undefined. */
  capacity: Incinerator["capacity"];
}

/**
 * A component that displays the capacity of an incinerator.
 * It only renders if the capacity value is provided.
 * @param {CapacityProps} props - The props for the component.
 */
const Capacity = ({ capacity }: CapacityProps) => {
  if (!capacity) return null;

  return (
    <div className="rounded-lg bg-[var(--blue)] p-3">
      <h4 className="mb-2 flex items-center font-semibold">
        <span className="mr-2">⚖️</span>
        {t("incineratorDetails.capacityTitle")}
      </h4>
      <p className="text-xl font-bold text-blue-600">
        {capacity.toLocaleString()} {t("incineratorDetails.capacityUnit")}
      </p>
    </div>
  );
};

export default Capacity;
