"use client";

import { useMapEvents } from "react-leaflet";
import type { LatLngBounds } from "leaflet";

/**
 * Props for the MapEvents component.
 */
interface MapEventsProps {
  /**
   * Callback function that is triggered when the map's viewport changes (on zoom or move end).
   * @param bounds The new map bounds.
   * @param zoom The new zoom level.
   */
  onViewportChange: (bounds: LatLngBounds, zoom: number) => void;
}

/**
 * A utility component that listens for map events (zoomend, moveend) and
 * calls the onViewportChange callback with the new map state.
 * This component must be rendered as a child of a MapContainer.
 * @param {MapEventsProps} props - The props for the component.
 */
const MapEvents = ({ onViewportChange }: MapEventsProps) => {
  const map = useMapEvents({
    zoomend: () => {
      onViewportChange(map.getBounds(), map.getZoom());
    },
    moveend: () => {
      onViewportChange(map.getBounds(), map.getZoom());
    },
  });

  // This component does not render anything itself.
  return null;
};

export default MapEvents;
