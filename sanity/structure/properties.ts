import { createClient } from "next-sanity";
import { Building2, CircleDot, LayoutGrid, MapPin } from "lucide-react";
import type { StructureBuilder } from "sanity/structure";
import { projectId, dataset, apiVersion } from "../env";

// Browser-safe client used only by the Studio's desk structure to read the
// list of locations. Runs lazily when the "By location" menu is expanded.
const studioClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

const CATEGORIES = [
  { value: "villa", label: "Villas" },
  { value: "apartment", label: "Apartments" },
  { value: "farmland", label: "Farmlands" },
];

const STATUSES = ["Available", "Under Offer", "Sold"];

const PROPERTY_ORDER: { field: string; direction: "asc" | "desc" }[] = [{ field: "folio", direction: "asc" }];

/** The "Properties" menu: quick-create, all listings, and grouped views. */
export function propertiesMenu(S: StructureBuilder) {
  return S.listItem()
    .id("properties")
    .title("Properties")
    .icon(Building2)
    .child(
      S.list()
        .title("Properties")
        .items([
          S.listItem()
            .id("all-properties")
            .title("All properties")
            .icon(Building2)
            .child(
              S.documentList()
                .id("all-properties-list")
                .title("All properties")
                .filter('_type == "property"')
                .defaultOrdering(PROPERTY_ORDER)
            ),
          S.divider(),
          S.listItem()
            .id("by-location")
            .title("By location")
            .icon(MapPin)
            .child(async () => locationMenu(S)),
          S.listItem()
            .id("by-category")
            .title("By category")
            .icon(LayoutGrid)
            .child(categoryMenu(S)),
          S.listItem()
            .id("by-status")
            .title("By status")
            .icon(CircleDot)
            .child(statusMenu(S)),
        ])
    );
}

/** One list per location found in the dataset, ordered by folio. */
async function locationMenu(S: StructureBuilder) {
  const locations = await studioClient.fetch<{ location?: string }[]>(`*[_type == "property"]{location}`);
  const unique = [...new Set(
    locations
      .map((l) => l.location?.trim())
      .filter((l): l is string => Boolean(l))
  )].sort((a, b) => a.localeCompare(b));

  return S.list()
    .title("By location")
    .items(
      unique.length === 0
        ? [S.listItem().title("No properties yet").child(S.documentList().filter('_type == "property"'))]
        : unique.map((loc) =>
            S.listItem()
              .title(loc)
              .id(`loc-${loc.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "location"}`)
              .child(
                S.documentList()
                  .title(loc)
                  .filter('_type == "property" && trim(location) == $loc')
                  .params({ loc })
                  .defaultOrdering(PROPERTY_ORDER)
              )
          )
    );
}

/** Fixed three groups: villas, apartments, farmlands. */
function categoryMenu(S: StructureBuilder) {
  return S.list()
    .title("By category")
    .items(
      CATEGORIES.map(({ value, label }) =>
        S.listItem()
          .title(label)
          .id(`cat-${value}`)
          .child(
            S.documentList()
              .title(label)
              .filter('_type == "property" && category == $cat')
              .params({ cat: value })
              .defaultOrdering(PROPERTY_ORDER)
          )
      )
    );
}

/** Fixed three groups: available, under offer, sold. */
function statusMenu(S: StructureBuilder) {
  return S.list()
    .title("By status")
    .items(
      STATUSES.map((status) =>
        S.listItem()
          .title(status)
          .id(`status-${status.toLowerCase().replace(/\s+/g, "-")}`)
          .child(
            S.documentList()
              .title(status)
              .filter('_type == "property" && status == $status')
              .params({ status })
              .defaultOrdering(PROPERTY_ORDER)
          )
      )
    );
}