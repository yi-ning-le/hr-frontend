// @vitest-environment jsdom
import { describe, expect, it } from "vitest";

describe("jsdom check", () => {
  it("should have document defined", () => {
    expect(document).toBeDefined();
  });
});
