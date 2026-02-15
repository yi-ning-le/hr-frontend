// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { MyProfilePage } from "@/pages/profile/MyProfilePage";
import { Route } from "@/routes/_protected/profile";

describe("Profile Route", () => {
  it("uses MyProfilePage as component", () => {
    expect(Route.options.component).toBe(MyProfilePage);
  });

  it("has _protected as parent route", () => {
    // The parent route is defined by getParentRoute function
    expect(typeof Route.options.getParentRoute).toBe("function");
  });

  it("is a TanStack Route object", () => {
    expect(Route).toBeDefined();
    expect(Route.options).toBeDefined();
    expect(Route.options.component).toBeDefined();
  });
});
