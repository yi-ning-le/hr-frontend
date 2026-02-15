// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import {
  EmployeeStatusEnum,
  EmploymentTypeEnum,
  employeeInputSchema,
  employeeListResultSchema,
  employeeSchema,
} from "@/lib/schemas/employee";

describe("EmployeeStatusEnum", () => {
  it.each([
    ["Active", true],
    ["OnLeave", true],
    ["Resigned", true],
    ["Terminated", true],
    ["Unknown", false],
    ["", false],
  ])("validates status %s as %s", (value, shouldPass) => {
    const result = EmployeeStatusEnum.safeParse(value);
    expect(result.success).toBe(shouldPass);
  });
});

describe("EmploymentTypeEnum", () => {
  it.each([
    ["FullTime", true],
    ["PartTime", true],
    ["Contract", true],
    ["Intern", true],
    ["Freelance", false],
    ["", false],
  ])("validates employment type %s as %s", (value, shouldPass) => {
    const result = EmploymentTypeEnum.safeParse(value);
    expect(result.success).toBe(shouldPass);
  });
});

describe("employeeSchema", () => {
  const validEmployee = {
    id: "emp-1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+86 13800138000",
    department: "Engineering",
    position: "Frontend Developer",
    status: "Active",
    employmentType: "FullTime",
    joinDate: "2024-01-15",
  };

  it("validates a complete employee object with string joinDate", () => {
    const result = employeeSchema.safeParse(validEmployee);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.joinDate).toBeInstanceOf(Date);
    }
  });

  it("validates a complete employee object with Date joinDate", () => {
    const employeeWithDate = {
      ...validEmployee,
      joinDate: new Date("2024-01-15"),
    };
    const result = employeeSchema.safeParse(employeeWithDate);
    expect(result.success).toBe(true);
  });

  it("validates employee with optional fields", () => {
    const employeeWithOptionals = {
      ...validEmployee,
      managerId: "manager-1",
      userId: "user-1",
      temporaryPassword: "temp123",
    };
    const result = employeeSchema.safeParse(employeeWithOptionals);
    expect(result.success).toBe(true);
  });

  it.each([
    ["id", ""],
    ["firstName", ""],
    ["lastName", ""],
    ["email", "invalid-email"],
    ["department", ""],
    ["position", ""],
    ["status", "Unknown"],
    ["employmentType", "Freelance"],
  ])("fails validation with invalid %s", (field, invalidValue) => {
    const invalidEmployee = { ...validEmployee, [field]: invalidValue };
    const result = employeeSchema.safeParse(invalidEmployee);
    expect(result.success).toBe(false);
  });

  it("fails validation for missing required fields", () => {
    const { id: _id, ...employeeWithoutId } = validEmployee;
    const result = employeeSchema.safeParse(employeeWithoutId);
    expect(result.success).toBe(false);
  });
});

describe("employeeInputSchema", () => {
  const validInput = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+86 13800138000",
    department: "Engineering",
    position: "Frontend Developer",
    joinDate: "2024-01-15",
  };

  it("validates employee input with all required fields", () => {
    const result = employeeInputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("validates employee input without optional status and employmentType", () => {
    const result = employeeInputSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("validates employee input with optional fields", () => {
    const inputWithOptionals = {
      ...validInput,
      status: "Active",
      employmentType: "FullTime",
      managerId: "manager-1",
    };
    const result = employeeInputSchema.safeParse(inputWithOptionals);
    expect(result.success).toBe(true);
  });

  it("transforms string joinDate to Date", () => {
    const result = employeeInputSchema.parse(validInput);
    expect(result.joinDate).toBeInstanceOf(Date);
  });

  it.each([
    ["firstName", ""],
    ["lastName", ""],
    ["email", "invalid"],
    ["phone", ""],
    ["department", ""],
    ["position", ""],
  ])("fails validation with invalid %s", (field, invalidValue) => {
    const invalidInput = { ...validInput, [field]: invalidValue };
    const result = employeeInputSchema.safeParse(invalidInput);
    expect(result.success).toBe(false);
  });
});

describe("employeeListResultSchema", () => {
  const validResult = {
    employees: [
      {
        id: "emp-1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+86 13800138000",
        department: "Engineering",
        position: "Frontend Developer",
        status: "Active",
        employmentType: "FullTime",
        joinDate: "2024-01-15",
      },
    ],
    total: 1,
    page: 1,
    limit: 10,
  };

  it("validates a list result with employees array", () => {
    const result = employeeListResultSchema.safeParse(validResult);
    expect(result.success).toBe(true);
  });

  it("validates an empty list result", () => {
    const emptyResult = {
      employees: [],
      total: 0,
      page: 1,
      limit: 10,
    };
    const result = employeeListResultSchema.safeParse(emptyResult);
    expect(result.success).toBe(true);
  });

  it("fails validation with non-array employees", () => {
    const invalidResult = { ...validResult, employees: null };
    const result = employeeListResultSchema.safeParse(invalidResult);
    expect(result.success).toBe(false);
  });

  it("allows zero as valid total", () => {
    const resultWithZero = { ...validResult, total: 0 };
    const result = employeeListResultSchema.safeParse(resultWithZero);
    expect(result.success).toBe(true);
  });
});
