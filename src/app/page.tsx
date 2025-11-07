// Main page component for the incinerator map webapp
import MapWrapper from "@/components/map/MapWrapper";
import { getIncinerators } from "@/lib/api";
import type { Incinerator } from "@/types/incinerator";

// Exported async component for Next.js
export default async function Page() {
  // Fetch incinerator data using the new API layer
  const incinerators: Incinerator[] = await getIncinerators();

  // Render the map with incinerator data
  return <MapWrapper incinerators={incinerators} />;
}
