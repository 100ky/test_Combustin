import { t } from "@/utils/translations";

export default function IncineratorsPage() {
  return (
    <div className="h-[calc(100vh-80px)] w-full">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">{t("navigation.incinerators")}</h1>
        </div>
      </div>
    </div>
  );
}
