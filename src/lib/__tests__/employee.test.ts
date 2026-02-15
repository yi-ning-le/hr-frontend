import { describe, expect, it } from "vitest";
import {
  getEmployeeStatusKey,
  getEmploymentTypeKey,
  getStatusVariant,
} from "@/lib/employee";
import type { EmployeeStatus, EmploymentType } from "@/types/employee";

describe("getStatusVariant", () => {
  it.each([
    ["Active", "default"],
    ["OnLeave", "secondary"],
    ["Resigned", "destructive"],
    ["Terminated", "destructive"],
  ] as [
    EmployeeStatus,
    string,
  ][])("returns %s variant for status %s", (status, expected) => {
    expect(getStatusVariant(status)).toBe(expected);
  });

  it("returns outline for unknown status", () => {
    const unknownStatus = "Unknown" as EmployeeStatus;
    expect(getStatusVariant(unknownStatus)).toBe("outline");
  });
});

describe("getEmployeeStatusKey", () => {
  it.each([
    ["Active", "employees.status.active"],
    ["OnLeave", "employees.status.onLeave"],
    ["Resigned", "employees.status.resigned"],
    ["Terminated", "employees.status.terminated"],
  ] as [
    EmployeeStatus,
    string,
  ][])("returns correct i18n key for status %s", (status, expected) => {
    expect(getEmployeeStatusKey(status)).toBe(expected);
  });

  it("returns fallback key for unknown status", () => {
    const unknownStatus = "Unknown" as EmployeeStatus;
    expect(getEmployeeStatusKey(unknownStatus)).toBe(
      "employees.status.Unknown",
    );
  });
});

describe("getEmploymentTypeKey", () => {
  it.each([
    ["FullTime", "employees.type.fullTime"],
    ["PartTime", "employees.type.partTime"],
    ["Contract", "employees.type.contract"],
    ["Intern", "employees.type.intern"],
  ] as [
    EmploymentType,
    string,
  ][])("returns correct i18n key for type %s", (type, expected) => {
    expect(getEmploymentTypeKey(type)).toBe(expected);
  });

  it("returns fallback key for unknown employment type", () => {
    const unknownType = "Freelance" as EmploymentType;
    expect(getEmploymentTypeKey(unknownType)).toBe("employees.type.Freelance");
  });
});
