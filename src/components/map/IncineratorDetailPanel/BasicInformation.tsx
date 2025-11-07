"use client";

import { t } from "@/utils/translations";
import type { Incinerator } from "@/types/incinerator";

/**
 * Props for the BasicInformation component.
 */
interface BasicInformationProps {
  /** The incinerator data to display. */
  incinerator: Pick<
    Incinerator,
    "id" | "yearEstablished" | "streetAddress" | "location"
  >;
}

/**
 * A component to display a single row of information with a label and a value.
 * @param {object} props - The props for the component.
 * @param {string} props.label - The label for the information row.
 * @param {string | number} props.value - The value to be displayed.
 */
const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex justify-between">
    <span>{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

/**
 * A component that displays basic information about an incinerator,
 * such as ID, establishment year, address, and coordinates.
 * @param {BasicInformationProps} props - The props for the component.
 */
const BasicInformation = ({ incinerator }: BasicInformationProps) => (
  <div className="rounded-lg bg-[var(--background-muted)] p-3">
    <h4 className="mb-2 font-semibold">
      {t("incineratorDetails.basicInfoTitle")}
    </h4>
    <div className="space-y-1 text-sm">
      <InfoRow label={t("incineratorDetails.id")} value={incinerator.id} />
      <InfoRow
        label={t("incineratorDetails.established")}
        value={incinerator.yearEstablished || t("incineratorDetails.unknown")}
      />
      <InfoRow
        label={t("incineratorDetails.address")}
        value={incinerator.streetAddress || t("incineratorDetails.unknown")}
      />
      <InfoRow
        label={t("incineratorDetails.latitude")}
        value={incinerator.location.lat.toFixed(6)}
      />
      <InfoRow
        label={t("incineratorDetails.longitude")}
        value={incinerator.location.lng.toFixed(6)}
      />
    </div>
  </div>
);

export default BasicInformation;
