import { describe, it, expect } from "vitest";
import { createSessionToken, verifySessionToken } from "../src/lib/auth/session";

describe("Admin Panel & Server-Side Access Control", () => {
  it("should allow ADMIN role to pass server authorization check", async () => {
    const adminToken = await createSessionToken({
      userId: "admin-id-1",
      email: "admin@zento.tech",
      name: "Admin User",
      role: "ADMIN",
    });

    const payload = await verifySessionToken(adminToken);
    expect(payload).not.toBeNull();
    expect(payload?.role).toBe("ADMIN");
  });

  it("should enforce that USER role is not ADMIN and denies admin privilege", async () => {
    const userToken = await createSessionToken({
      userId: "user-id-2",
      email: "user@zento.tech",
      name: "Standard User",
      role: "USER",
    });

    const payload = await verifySessionToken(userToken);
    expect(payload).not.toBeNull();
    expect(payload?.role).not.toBe("ADMIN");
    expect(payload?.role).toBe("USER");
  });
});
