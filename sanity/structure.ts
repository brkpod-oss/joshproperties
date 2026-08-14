import type { StructureResolver } from "sanity/structure";

export const SINGLETONS = [
  { id: "siteSettings", title: "Site settings" },
  { id: "homePage", title: "Home page" },
  { id: "contactPage", title: "Contact page" },
];

export const SINGLETON_IDS = new Set(SINGLETONS.map((s) => s.id));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      ...SINGLETONS.map(({ id, title }) =>
        S.listItem()
          .id(id)
          .title(title)
          .child(S.document().schemaType(id).documentId(id))
      ),
      S.divider(),
      S.documentTypeListItem("categoryPage").title("Category pages"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !SINGLETONS.some((s) => s.id === item.getId()) &&
          item.getId() !== "categoryPage"
      ),
    ]);
