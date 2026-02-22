import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import "./i18n-mock";

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

class DOMMatrixMock {
  static fromFloat32Array(_array32: Float32Array) {
    return new DOMMatrixMock() as unknown as DOMMatrix;
  }

  static fromFloat64Array(_array64: Float64Array) {
    return new DOMMatrixMock() as unknown as DOMMatrix;
  }

  static fromMatrix(_other?: DOMMatrixInit) {
    return new DOMMatrixMock() as unknown as DOMMatrix;
  }

  toString() {
    return "matrix(1, 0, 0, 1, 0, 0)";
  }
}

globalThis.DOMMatrix = DOMMatrixMock as unknown as typeof DOMMatrix;
