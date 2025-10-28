"use client";
/**
 * Main map component that displays incinerator locations.
 * Fetches and displays detailed incinerator data in a popup on marker click.
 */

import "./Map.css";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { memo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";

import {
  MAP_CONSTANTS,
  createIncineratorPopupContent,
} from "@/utils/mapHelpers";
import { Incinerator } from "@/types/incinerator";
import { getIncineratorDetails } from "@/lib/api";
import MarkerWithDblClick from "./MarkerWithDblClick";

interface MapProps {
  incinerators: Incinerator[];
}

const Map = memo(({ incinerators }: MapProps) => {
  /**
   * Handles the click event on a map marker.
   * Fetches detailed data for the clicked incinerator and updates the popup content.
   * @param e The Leaflet mouse event.
   * @param incineratorId The ID of the clicked incinerator.
   */
  const handleMarkerClick = async (
    e: LeafletMouseEvent,
    incineratorId: number | string,
  ) => {
    const popup = e.target.getPopup();
    if (!popup) return;

    try {
      // 1. Show a loading message in the popup immediately.
      popup.setContent("<p>Loading details...</p>");
      popup.update();

      // 2. Fetch detailed data from the API endpoint using the server action.
      const detailedIncinerator = await getIncineratorDetails(String(incineratorId));

      // 3. Generate the new popup content with the fetched data.
      const newContent = createIncineratorPopupContent(detailedIncinerator);

      // 4. Update the popup with the new content.
      popup.setContent(newContent);
      popup.update();
    } catch (error) {
      // On error, display an error message in the popup.
      popup.setContent(
        '<p style="color: red;">Error loading details.</p>',
      );
      popup.update();
      console.error("Failed to fetch incinerator details:", error);
    }
  };

  return (
    <div className="map-container" style={MAP_CONSTANTS.MAP_STYLE}>
      <MapContainer
        center={MAP_CONSTANTS.DEFAULT_CENTER}
        zoom={MAP_CONSTANTS.DEFAULT_ZOOM}
        minZoom={MAP_CONSTANTS.MIN_ZOOM}
        maxZoom={MAP_CONSTANTS.MAX_ZOOM}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {(incinerators || [])
          .filter(
            (i) =>
              i.location &&
              typeof i.location.lat === "number" &&
              typeof i.location.lng === "number",
          )
          .map((incinerator) => (
            <MarkerWithDblClick
                key={incinerator.id}
                incinerator={incinerator}
                handleMarkerClick={handleMarkerClick}
            />
          ))}
      </MapContainer>
    </div>
  );
});

Map.displayName = "Map";

export default Map;
