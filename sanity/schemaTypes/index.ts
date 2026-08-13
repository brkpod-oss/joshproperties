import type { SchemaTypeDefinition } from "sanity";
import property from "./property";
import farmlandOption from "./farmlandOption";
import testimonial from "./testimonial";
import faq from "./faq";
import stat from "./stat";
import service from "./service";
import processStep from "./processStep";
import partnerLogo from "./partnerLogo";
import promiseItem from "./promiseItem";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [property, farmlandOption, testimonial, faq, stat, service, processStep, partnerLogo, promiseItem],
};
