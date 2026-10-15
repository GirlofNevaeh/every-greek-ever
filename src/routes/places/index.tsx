import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { GreeceMap } from "@/components/map";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/places/")({
  component: PlacesPage,
});

function PlacesPage() {
  const { t } = useI18n();
  return (
    <Shell>
      <h1 className="font-display text-4xl">{t("nav.places")}</h1>
      <p className="mt-2 max-w-xl text-lg">{t("places.intro")}</p>
      <div className="mt-4">
        <GreeceMap />
      </div>
    </Shell>
  );
}
