import { describe, expect, it } from "vitest";
import { employeeSearchSchema } from "../employees";

describe("employees route search schema", () => {
  it("falls back to safe defaults when page/limit are below minimum", () => {
    const parsed = employeeSearchSchema.parse({ page: 0, limit: 0 });

    expect(parsed.page).toBe(1);
    expect(parsed.limit).toBe(20);
  });

  it("falls back to safe defaults when page/limit exceed maximum", () => {
    const parsed = employeeSearchSchema.parse({ page: 5000, limit: 200 });

    expect(parsed.page).toBe(1);
    expect(parsed.limit).toBe(20);
  });
});
