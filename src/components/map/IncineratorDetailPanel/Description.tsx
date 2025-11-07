"use client";

import { t } from "@/utils/translations";

/**
 * Props for the Description component.
 */
interface DescriptionProps {
  /** The description text for the incinerator. Can be null or undefined. */
  description: string | null | undefined;
}

/**
 * A component that displays the description of an incinerator.
 * It only renders if a description is provided.
 * @param {DescriptionProps} props - The props for the component.
 */
const Description = ({ description }: DescriptionProps) => {
  if (!description) return null;

  return (
    <div className="rounded-lg bg-[var(--background-muted)] p-3">
      <h4 className="mb-2 font-semibold">
        {t("incineratorDetails.descriptionTitle")}
      </h4>
      <p className="text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default Description;
