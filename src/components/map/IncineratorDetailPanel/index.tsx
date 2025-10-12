"use client";

import { memo } from "react";
import type { Incinerator } from "@/types/incinerator";
import PanelHeader from "./PanelHeader";
import NameAndStatus from "./NameAndStatus";
import BasicInformation from "./BasicInformation";
import Capacity from "./Capacity";
import Description from "./Description";
import BuildingDetails from "./BuildingDetails";
import NoIncineratorSelected from "./NoIncineratorSelected";

/**
 * Props for the IncineratorDetailPanel component.
 */
interface IncineratorDetailPanelProps {
  /** The incinerator object to display details for. Can be null if no incinerator is selected. */
  incinerator: Incinerator | null;
  /** Whether the sidebar is currently open. */
  isOpen: boolean;
  /** Callback function to close the sidebar. */
  onClose: () => void;
}

/**
 * A responsive sidebar component that displays detailed information about a selected incinerator.
 * It is composed of several smaller components to display different sections of the data.
 * @param {IncineratorDetailPanelProps} props - The props for the component.
 */
const IncineratorDetailPanel = memo(
  ({ incinerator, isOpen, onClose }: IncineratorDetailPanelProps) => {
    if (!isOpen) return null;

    return (
      <div className="flex h-full flex-col">
        <PanelHeader onClose={onClose} />

        <div className="flex-1 overflow-y-auto p-4">
          {incinerator ? (
            <div className="space-y-4">
              <NameAndStatus incinerator={incinerator} />
              <BasicInformation incinerator={incinerator} />
              <Capacity capacity={incinerator.capacity} />
              <Description description={incinerator.description} />
              <BuildingDetails buildings={incinerator.buildings} />
            </div>
          ) : (
            <NoIncineratorSelected />
          )}
        </div>
      </div>
    );
  },
);

IncineratorDetailPanel.displayName = "IncineratorDetailPanel";

export default IncineratorDetailPanel;
