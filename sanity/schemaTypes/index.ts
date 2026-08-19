import type { SchemaTypeDefinition } from "sanity";
import property from "./property";
import farmlandOption from "./farmlandOption";
import farmlandProject from "./farmlandProject";
import farmlandPlot from "./farmlandPlot";
import testimonial from "./testimonial";
import faq from "./faq";
import stat from "./stat";
import service from "./service";
import processStep from "./processStep";
import partnerLogo from "./partnerLogo";
import promiseItem from "./promiseItem";
import enquiryOption from "./enquiryOption";
import siteSettings from "./siteSettings";
import homePage from "./homePage";
import propertyPage from "./propertyPage";
import categoryPage from "./categoryPage";
import contactPage from "./contactPage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    property,
    farmlandOption,
    farmlandProject,
    farmlandPlot,
    testimonial,
    faq,
    stat,
    service,
    processStep,
    partnerLogo,
    promiseItem,
    enquiryOption,
    siteSettings,
    homePage,
    propertyPage,
    categoryPage,
    contactPage,
  ],
};
