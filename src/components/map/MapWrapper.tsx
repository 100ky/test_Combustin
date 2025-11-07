// This component ensures the map is rendered only on the client (browser)
"use client";
import dynamic from "next/dynamic";
import { memo, useState, useRef } from "react";
import type { LeafletMouseEvent, Map as LeafletMap } from "leaflet";
import type { Incinerator } from "@/types/incinerator";
import { createIncineratorPopupContent } from "@/utils/mapHelpers";
import { getIncineratorDetails } from "@/lib/api";
import type { IncineratorSidebarRef } from "./IncineratorSidebarContainer";
import IncineratorSidebarContainer from "./IncineratorSidebarContainer";

// Dynamically import the Map component so it only renders on the client (no SSR)
const Map = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="text-gray-600">Loading map...</div>
    </div>
  ),
});

// Props for the MapWrapper component: expects an array of incinerators
type MapWrapperProps = {
  incinerators: Incinerator[];
};

// Renders the map, filling the viewport minus the header height
const MapWrapper = ({ incinerators }: MapWrapperProps) => {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const incineratorSidebarRef = useRef<IncineratorSidebarRef>(null);

  const handleMarkerClick = async (
    e: LeafletMouseEvent,
    incineratorId: number | string,
  ) => {
    const popup = e.target.getPopup();
    if (!popup) return;

    try {
      popup.setContent("<p>Loading details...</p>");
      popup.update();

      const detailedIncinerator = await getIncineratorDetails(
        String(incineratorId),
      );
      const newContent = createIncineratorPopupContent(detailedIncinerator);
      popup.setContent(newContent);
      popup.update();
    } catch (error) {
      popup.setContent('<p style="color: red;">Error loading details.</p>');
      popup.update();
      console.error("Failed to fetch incinerator details:", error);
    }
  };

  return (
    <div className="flex h-[calc(100vh-var(--header-height))] w-full">
      <IncineratorSidebarContainer
        incinerators={incinerators}
        map={map}
        ref={incineratorSidebarRef}
      />
      <div className="h-full min-h-[500px] flex-1">
        <Map
          incinerators={incinerators}
          setMap={setMap}
          handleMarkerClick={handleMarkerClick}
          handleViewportChange={(bounds, zoom) => {
            incineratorSidebarRef.current?.handleViewportChange(bounds, zoom);
          }}
        />
      </div>
    </div>
  );
};

export default memo(MapWrapper);
