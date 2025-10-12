"use client";

import { t } from "@/utils/translations";

/**
 * Props for the PanelHeader component.
 */
interface PanelHeaderProps {
  /** Callback function to be invoked when the close button is clicked. */
  onClose: () => void;
}

/**
 * A header component for the detail panel, featuring a title and a close button.
 * @param {PanelHeaderProps} props - The props for the component.
 */
const PanelHeader = ({ onClose }: PanelHeaderProps) => (
  <div className="flex items-center justify-between border-b border-[var(--blue)] bg-[var(--background-muted)] p-4">
    <h2 className="text-lg font-bold">{t("incineratorDetails.title")}</h2>
    <button
      onClick={onClose}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[var(--background)]"
      aria-label="Close panel"
    >
      <span className="pb-1 text-xl">×</span>
    </button>
  </div>
);

export default PanelHeader;
