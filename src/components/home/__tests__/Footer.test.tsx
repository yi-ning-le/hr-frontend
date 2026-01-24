import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "../Footer";

describe("Footer", () => {
  it("renders the copyright text", () => {
    render(<Footer />);

    expect(screen.getByText("© 2026 HR System. All rights reserved.")).toBeInTheDocument();
  });
});
