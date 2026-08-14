import { describe, it, expect } from "vitest";
import { hashPassword, comparePassword } from "../src/lib/auth/password";
import {
  createSessionToken,
  verifySessionToken,
  UserSessionPayload,
} from "../src/lib/auth/session";

describe("Authentication & Password Security", () => {
  it("should securely hash and compare passwords", async () => {
    const plainPassword = "SuperSecretPassword123!";
    const hash = await hashPassword(plainPassword);

    expect(hash).not.toEqual(plainPassword);
    expect(hash.length).toBeGreaterThan(20);

    const isMatch = await comparePassword(plainPassword, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await comparePassword("WrongPassword!", hash);
    expect(isWrongMatch).toBe(false);
  });

  it("should create and verify JWT session token with USER role", async () => {
    const userPayload: UserSessionPayload = {
      userId: "user-123-abc",
      email: "customer@zento.tech",
      name: "Customer User",
      role: "USER",
    };

    const token = await createSessionToken(userPayload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe("user-123-abc");
    expect(decoded?.email).toBe("customer@zento.tech");
    expect(decoded?.role).toBe("USER");
  });

  it("should create and verify JWT session token with ADMIN role", async () => {
    const adminPayload: UserSessionPayload = {
      userId: "admin-999-xyz",
      email: "admin@zento.tech",
      name: "System Admin",
      role: "ADMIN",
    };

    const token = await createSessionToken(adminPayload);
    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.role).toBe("ADMIN");
  });

  it("should return null when verifying an invalid or tampered JWT token", async () => {
    const tamperedToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalidpayload.signature";
    const decoded = await verifySessionToken(tamperedToken);
    expect(decoded).toBeNull();
  });
});
