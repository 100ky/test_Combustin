// src/utils/mapHelpers.ts

import { Incinerator } from "../types/incinerator";

/**
 * Defines constants used for the map display.
 */
export const MAP_CONSTANTS = {
  MAP_STYLE: {
    height: "100%",
    width: "100%",
  },
  DEFAULT_CENTER: [49.75, 15.5] as [number, number],
  DEFAULT_ZOOM: 7,
  MIN_ZOOM: 6,
  MAX_ZOOM: 18,
  DETAIL_ZOOM_THRESHOLD: 14,
};

/**
 * Determines if an incinerator is planned for a future year.
 * @param incinerator The incinerator object.
 * @returns True if the incinerator's establishment year is in the future.
 */
export const isPlannedIncinerator = (incinerator: Incinerator): boolean => {
  if (!incinerator.yearEstablished) {
    return false;
  }
  const currentYear = new Date().getFullYear();
  return incinerator.yearEstablished > currentYear;
};

/**
 * Creates the HTML content for an incinerator's map popup.
 * Handles both basic and detailed data, providing fallbacks for null values.
 * @param incinerator The incinerator data object.
 * @returns An HTML string to be used as the popup content.
 */
export const createIncineratorPopupContent = (
  incinerator: Incinerator,
): string => {
  const isPlanned = isPlannedIncinerator(incinerator);

  const title = incinerator.name || `Incinerator #${incinerator.id}`;
  const status = incinerator.operational
    ? "Operational"
    : isPlanned
      ? "Planned"
      : "Non-operational";

  // Provide a fallback for capacity and description if they are not available.
  const capacity = incinerator.capacity
    ? `${incinerator.capacity.toLocaleString("en-US")} t/year`
    : "Unknown";
  const description = incinerator.description || "No description available.";

  // Check for detailed information
  const hasDetails =
    incinerator.buildings &&
    incinerator.buildings.some((building) => building.details !== null);
  const detailsMessage = hasDetails
    ? '<p style="margin: 8px 0 0 0; font-size: 12px; color: green;">Podrobnější informace jsou k dispozici.</p>'
    : "";

  // Construct the HTML for the popup.
  const html = `
    <div style="line-height: 1.6;">
      <h3 style="font-weight: bold; margin: 0 0 8px 0; font-size: 16px;">${title}</h3>
      <p style="margin: 0;"><strong>Status:</strong> ${status}</p>
      <p style="margin: 0;"><strong>Capacity:</strong> ${capacity}</p>
      <p style="margin: 8px 0 0 0; font-size: 13px;">${description}</p>
      ${detailsMessage}
    </div>
    `;

  return html;
};
