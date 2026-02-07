import { describe, it, expect, beforeEach } from "vitest";
import { useJobStore } from "../useJobStore";

describe("useJobStore", () => {
  beforeEach(() => {
    useJobStore.setState({
      isAddDialogOpen: false,
    });
  });

  it("should toggle add dialog", () => {
    useJobStore.getState().setIsAddDialogOpen(true);
    expect(useJobStore.getState().isAddDialogOpen).toBe(true);

    useJobStore.getState().setIsAddDialogOpen(false);
    expect(useJobStore.getState().isAddDialogOpen).toBe(false);
  });
});
