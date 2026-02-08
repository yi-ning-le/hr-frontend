import { describe, expect, it } from "vitest";
import { cn } from "../utils";

describe("utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("c1", "c2")).toBe("c1 c2");
    });

    it("should handle conditional classes", () => {
      const showC2 = true;
      const showC3 = false;
      expect(cn("c1", showC2 && "c2", showC3 && "c3")).toBe("c1 c2");
    });

    it("should handle arrays of classes", () => {
      expect(cn("c1", ["c2", "c3"])).toBe("c1 c2 c3");
    });

    it("should handle objects with boolean values", () => {
      expect(cn("c1", { c2: true, c3: false })).toBe("c1 c2");
    });

    it("should merge tailwind classes properly", () => {
      expect(cn("p-4", "p-2")).toBe("p-2");
      expect(cn("px-2 py-1", "p-4")).toBe("p-4");
    });

    it("should handle mixed inputs", () => {
      expect(cn("c1", { c2: true }, ["c3", { c4: true }])).toBe("c1 c2 c3 c4");
    });
  });
});
