"use client";
/**
 * Main map component that displays incinerator locations.
 */

import "./Map.css";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, TileLayer } from "react-leaflet";
import type {
  LatLngBounds,
  LeafletMouseEvent,
  Map as LeafletMap,
} from "leaflet";

import { MAP_CONSTANTS } from "@/utils/mapHelpers";
import type { Incinerator } from "@/types/incinerator";
import MarkerWithDblClick from "./MarkerWithDblClick";
import MapEvents from "./MapEvents";

interface MapProps {
  incinerators: Incinerator[];
  setMap: (map: LeafletMap | null) => void;
  handleViewportChange: (bounds: LatLngBounds, zoom: number) => void;
  handleMarkerClick: (
    e: LeafletMouseEvent,
    incineratorId: number | string,
  ) => Promise<void>;
}

const Map = ({
  incinerators,
  setMap,
  handleViewportChange,
  handleMarkerClick,
}: MapProps) => {
  return (
    <MapContainer
      ref={setMap}
      center={MAP_CONSTANTS.DEFAULT_CENTER}
      zoom={MAP_CONSTANTS.DEFAULT_ZOOM}
      minZoom={MAP_CONSTANTS.MIN_ZOOM}
      maxZoom={MAP_CONSTANTS.MAX_ZOOM}
      style={{ height: "100%", width: "100%" }}
      zoomControl={true}
      scrollWheelZoom={true}
      doubleClickZoom={false} // We handle double click manually
      dragging={true}
    >
      <MapEvents onViewportChange={handleViewportChange} />
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
  );
};

export default Map;
