"use client";

import { t } from "@/utils/translations";
import type { Incinerator } from "@/types/incinerator";

/**
 * Props for the NameAndStatus component.
 */
interface NameAndStatusProps {
  /** The incinerator data, containing at least id, name, and operational status. */
  incinerator: Pick<Incinerator, "id" | "name" | "operational">;
}

/**
 * A component that displays the name of the incinerator and its operational status badge.
 * @param {NameAndStatusProps} props - The props for the component.
 */
const NameAndStatus = ({ incinerator }: NameAndStatusProps) => (
  <div>
    <h3 className="mb-2 text-xl font-semibold">
      {incinerator.name ||
        t("incineratorDetails.nameAndId").replace(
          "{id}",
          String(incinerator.id),
        )}
    </h3>
    <span
      className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
        incinerator.operational
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {incinerator.operational
        ? t("incineratorDetails.operational")
        : t("incineratorDetails.nonOperational")}
    </span>
  </div>
);

export default NameAndStatus;
