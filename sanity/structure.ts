import type { StructureResolver } from "sanity/structure";
import { propertiesMenu } from "./structure/properties";

export const SINGLETONS = [
  { id: "siteSettings", title: "Site settings" },
  { id: "homePage", title: "Home page" },
  { id: "propertyPage", title: "Property page" },
  { id: "contactPage", title: "Contact page" },
];

export const SINGLETON_IDS = new Set(SINGLETONS.map((s) => s.id));

const singletonItem = (S: Parameters<StructureResolver>[0], { id, title }: (typeof SINGLETONS)[number]) =>
  S.listItem().id(id).title(title).child(S.document().schemaType(id).documentId(id));

const categoryItem = (S: Parameters<StructureResolver>[0]) =>
  S.documentTypeListItem("categoryPage").title("Category pages");
const enquiryItem = (S: Parameters<StructureResolver>[0]) =>
  S.documentTypeListItem("enquiryOption").title("Enquiry forms");
const projectItem = (S: Parameters<StructureResolver>[0]) =>
  S.documentTypeListItem("farmlandProject").title("Farmland projects");
const plotItem = (S: Parameters<StructureResolver>[0]) =>
  S.documentTypeListItem("farmlandPlot").title("Farmland plots");

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .id("dashboard")
        .title("Dashboard")
        .child(
          S.list()
            .title("Dashboard")
            .items([
              S.listItem()
                .id("welcome")
                .title("Welcome")
                .child(
                  S.list()
                    .title("Getting started")
                    .items([
                      ...SINGLETONS.map((s) => singletonItem(S, s)),
                      S.divider(),
                      categoryItem(S),
                      propertiesMenu(S),
                      enquiryItem(S),
                      projectItem(S),
                      plotItem(S),
                    ])
                ),
            ])
        ),
      S.divider(),
      ...SINGLETONS.map((s) => singletonItem(S, s)),
      S.divider(),
      propertiesMenu(S),
      S.divider(),
      categoryItem(S),
      S.divider(),
      enquiryItem(S),
      projectItem(S),
      plotItem(S),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !SINGLETONS.some((s) => s.id === item.getId()) &&
          item.getId() !== "categoryPage" &&
          item.getId() !== "property" &&
          item.getId() !== "enquiryOption" &&
          item.getId() !== "farmlandProject" &&
          item.getId() !== "farmlandPlot"
      ),
    ]);