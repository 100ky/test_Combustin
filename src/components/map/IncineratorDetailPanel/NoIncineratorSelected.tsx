"use client";

import { t } from "@/utils/translations";

/**
 * A placeholder component displayed when no incinerator is selected in the sidebar.
 */
const NoIncineratorSelected = () => (
  <div className="flex h-full items-center justify-center">
    <p>{t("incineratorDetails.noSelection")}</p>
  </div>
);

export default NoIncineratorSelected;
