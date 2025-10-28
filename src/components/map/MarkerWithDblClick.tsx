"use client";

import { useState, useEffect } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import { Incinerator } from "@/types/incinerator";
import { getIncineratorIcon } from "./mapIcons";
import { isPlannedIncinerator } from "@/utils/mapHelpers";

export interface MarkerWithDblClickProps {
  incinerator: Incinerator;
  handleMarkerClick: (e: LeafletMouseEvent, incineratorId: number | string) => void;
}

/**
 * A wrapper for the Leaflet Marker that adds custom handling for
 * single and double clicks.
 * - Single click: Opens a popup with incinerator details.
 * - Double click: Zooms in on the incinerator with a fly-to animation.
 */
const MarkerWithDblClick = ({ incinerator, handleMarkerClick }: MarkerWithDblClickProps) => {
    const map = useMap();
    const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            if (clickTimeout) {
                clearTimeout(clickTimeout);
            }
        };
    }, [clickTimeout]);

    const handleClick = (e: LeafletMouseEvent) => {
        // Clear any pending click timeout
        if (clickTimeout) {
            clearTimeout(clickTimeout);
        }
        // Set a new timeout to handle the single click
        const timeout = setTimeout(() => {
            handleMarkerClick(e, incinerator.id);
        }, 200);
        setClickTimeout(timeout);
    };

    const handleDoubleClick = () => {
        // Clear the single-click timeout so it doesn't fire
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            setClickTimeout(null);
        }

        // Perform the zoom animation
        map.flyTo([incinerator.location.lat, incinerator.location.lng], 15, {
            animate: true,
            duration: 1.0,
        });
    };

    return (
        <Marker
            position={[incinerator.location.lat, incinerator.location.lng]}
            icon={getIncineratorIcon(
                incinerator.operational,
                isPlannedIncinerator(incinerator),
            )}
            eventHandlers={{
                click: handleClick,
                dblclick: handleDoubleClick,
            }}
        >
            {/* Popup is a placeholder; content is set dynamically on click. */}
            <Popup />
        </Marker>
    );
};

export default MarkerWithDblClick;
