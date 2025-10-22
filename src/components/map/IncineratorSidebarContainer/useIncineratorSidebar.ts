import { useState } from "react";
import type { LatLngBounds, Map as LeafletMap } from "leaflet";
import type { Incinerator } from "@/types/incinerator";
import { getIncineratorDetails, getBuildingDetails } from "@/lib/api";
import { MAP_CONSTANTS } from "@/utils/mapHelpers";

/**
 * Props for the useIncineratorSidebar custom hook.
 */
interface UseIncineratorSidebarProps {
  /** A list of all incinerators. */
  incinerators: Incinerator[];
  /** The Leaflet map instance. */
  map: LeafletMap | null;
}

/**
 * A custom hook to manage the state and logic for the incinerator details sidebar.
 * @param {UseIncineratorSidebarProps} props - The props for the hook.
 * @returns An object containing the sidebar state and functions to interact with it.
 */
export const useIncineratorSidebar = ({
  incinerators,
  map,
}: UseIncineratorSidebarProps) => {
  const [selectedIncinerator, setSelectedIncinerator] =
    useState<Incinerator | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /**
   * Closes the sidebar and clears the selected incinerator after a short delay for the closing animation.
   */
  const closeSidebar = () => {
    setSidebarOpen(false);
    setTimeout(() => {
      setSelectedIncinerator(null);
    }, 300); // Corresponds to the transition duration
  };

  /**
   * Opens the sidebar and fetches detailed information for the given incinerator ID.
   * @param incineratorId The ID of the incinerator to display.
   */
  const openIncineratorInSidebar = async (incineratorId: number | string) => {
    // Prevent re-fetching if the same incinerator is already open.
    if (sidebarOpen && selectedIncinerator?.id === incineratorId) {
      return;
    }

    try {
      map?.closePopup(); // Close any open map popups.
      // Fetch basic incinerator details.
      const detailedIncinerator = await getIncineratorDetails(
        String(incineratorId),
      );

      // If the incinerator has associated buildings, fetch their details as well.
      if (
        detailedIncinerator.buildings &&
        detailedIncinerator.buildings.length > 0
      ) {
        const buildingDetailsPromises = detailedIncinerator.buildings.map(
          (building) =>
            getBuildingDetails(String(building.id)),
        );
        const buildingsWithDetails = await Promise.all(buildingDetailsPromises);
        detailedIncinerator.buildings = buildingsWithDetails;
      }

      setSelectedIncinerator(detailedIncinerator); // Set the detailed incinerator.
      setSidebarOpen(true); // Open the sidebar.
    } catch (error) {
      console.error("Failed to fetch details for sidebar:", error);
    }
  };

  /**
   * Handles changes in the map's viewport (bounds and zoom level).
   * If zoomed in enough and only one incinerator is visible, it opens its details in the sidebar.
   * Otherwise, it closes the sidebar.
   * @param bounds The current geographical bounds of the map viewport.
   * @param zoom The current zoom level of the map.
   */
  const handleViewportChange = async (bounds: LatLngBounds, zoom: number) => {
    if (zoom >= MAP_CONSTANTS.DETAIL_ZOOM_THRESHOLD) {
      // Filter incinerators that are currently visible within the map bounds.
      const visibleIncinerators = incinerators.filter((inc) =>
        bounds.contains([inc.location.lat, inc.location.lng]),
      );

      // If exactly one incinerator is visible, open its details.
      if (visibleIncinerators.length === 1) {
        const incineratorToShow = visibleIncinerators[0];
        // Avoid re-opening if it's already selected
        if (selectedIncinerator?.id !== incineratorToShow.id) {
          await openIncineratorInSidebar(incineratorToShow.id);
        }
      }
    } else {
      // If zoomed out, close the sidebar if it's open.
      if (sidebarOpen) {
        closeSidebar();
      }
    }
  };

  return {
    sidebarOpen,
    selectedIncinerator,
    closeSidebar,
    openIncineratorInSidebar,
    handleViewportChange,
  };
};
