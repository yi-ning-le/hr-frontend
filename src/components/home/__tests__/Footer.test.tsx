import { Footer } from "@/components/layout/Footer";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";


describe("Footer", () => {
  it("renders the copyright text", () => {
    render(<Footer />);

    expect(screen.getByText("footer.copyright")).toBeInTheDocument();
  });
});
