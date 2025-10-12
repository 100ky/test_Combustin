import { memo, useImperativeHandle, forwardRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import type { Incinerator } from "@/types/incinerator";
import IncineratorDetailPanel from "../IncineratorDetailPanel";
import { useIncineratorSidebar } from "./useIncineratorSidebar";

/**
 * Defines the interface for the ref object exposed by this component,
 * allowing parent components to call its methods.
 */
export interface IncineratorSidebarRef {
  /** Handles changes in the map's viewport to automatically show/hide the sidebar. */
  handleViewportChange: (
    bounds: import("leaflet").LatLngBounds,
    zoom: number,
  ) => Promise<void>;
  /** Programmatically opens the sidebar for a specific incinerator. */
  openIncineratorInSidebar: (incineratorId: number | string) => Promise<void>;
}

/**
 * Defines the props for the IncineratorSidebarContainer component.
 */
interface IncineratorSidebarContainerProps {
  /** A list of all incinerators. */
  incinerators: Incinerator[];
  /** The Leaflet map instance. */
  map: LeafletMap | null;
}

/**
 * A container component for the Incinerator detail sidebar.
 * It uses the `useIncineratorSidebar` hook to manage state and logic,
 * and primarily handles rendering the sidebar panel and its container.
 * It exposes methods via a ref to allow parent components to control the sidebar.
 */
const IncineratorSidebarContainer = forwardRef<
  IncineratorSidebarRef,
  IncineratorSidebarContainerProps
>(({ incinerators, map }, ref) => {
  const {
    sidebarOpen,
    selectedIncinerator,
    closeSidebar,
    openIncineratorInSidebar,
    handleViewportChange,
  } = useIncineratorSidebar({ incinerators, map });

  // Exposes functions from the hook to the parent component via ref.
  useImperativeHandle(ref, () => ({
    handleViewportChange,
    openIncineratorInSidebar,
  }));

  return (
    // Sidebar container with dynamic width based on its open state.
    <div
      className={`transition-all duration-300 ease-in-out ${
        sidebarOpen ? "w-96" : "w-0"
      } z-20 shadow-lg`}
    >
      {/* The actual detail panel, which is displayed inside the animated container. */}
      <IncineratorDetailPanel
        incinerator={selectedIncinerator}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />
    </div>
  );
});

IncineratorSidebarContainer.displayName = "IncineratorSidebarContainer";
export default memo(IncineratorSidebarContainer);
