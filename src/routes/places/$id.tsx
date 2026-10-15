import { createFileRoute, Link } from "@tanstack/react-router";
import { Pager, Shell, Why } from "@/components/shell";
import { Portrait } from "@/components/art";
import { neighbors, nice, places } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/places/$id")({
  component: PlacePage,
});

function PlacePage() {
  const { id } = Route.useParams();
  const { t } = useI18n();
  const place = places.find((item) => item.id === id);
  if (!place) {
    return (
      <Shell>
        <h1 className="font-display text-4xl">{t("ui.missing")}</h1>
      </Shell>
    );
  }
  const { prev, next } = neighbors(places, id);
  return (
    <Shell>
      <Link to="/places" className="text-sm font-bold text-blue">
        {t("nav.places")}
      </Link>
      <div className="mt-3 overflow-hidden rounded-[2rem] border-2 border-blue bg-paper">
        <Portrait prop={place.prop} frame="land" label={nice(place.id)} />
      </div>
      <h1 className="mt-4 font-display text-5xl">{nice(place.id)}</h1>
      <p className="mt-3 text-lg">{t(`place.${place.id}.a`)}</p>
      <p className="mt-2 text-lg">{t(`place.${place.id}.b`)}</p>
      <Why k={`place.${place.id}.why`} />
      <Pager
        prev={prev ? { to: "/places/$id", id: prev.id, label: nice(prev.id) } : undefined}
        next={next ? { to: "/places/$id", id: next.id, label: nice(next.id) } : undefined}
      />
    </Shell>
  );
}
