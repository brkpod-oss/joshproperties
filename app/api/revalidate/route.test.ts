import { describe, expect, it } from "vitest";
import { getTagsForType } from "./route";

describe("getTagsForType", () => {
  it("maps a known document type to its own tag", () => {
    expect(getTagsForType("property")).toEqual(["property"]);
  });

  it("returns an empty array for an unknown type", () => {
    expect(getTagsForType("somethingElse")).toEqual([]);
  });
});
