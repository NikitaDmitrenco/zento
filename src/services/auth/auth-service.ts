import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../../db";
import { users } from "../../db/schema";
import { hashPassword, comparePassword } from "../../lib/auth/password";
import {
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
  getSession,
  UserSessionPayload,
} from "../../lib/auth/session";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["USER", "ADMIN"]).optional().default("USER"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export async function registerUser(input: RegisterInput): Promise<{
  user: { id: string; email: string; name: string; role: "USER" | "ADMIN" };
  token: string;
}> {
  const validated = registerSchema.parse(input);

  // Check if user with email already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, validated.email.toLowerCase()),
  });

  if (existingUser) {
    throw new Error("EMAIL_EXISTS");
  }

  const passwordHash = await hashPassword(validated.password);

  const [newUser] = await db
    .insert(users)
    .values({
      name: validated.name,
      email: validated.email.toLowerCase(),
      passwordHash,
      role: validated.role || "USER",
    })
    .returning();

  const payload: UserSessionPayload = {
    userId: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
  };

  const token = await createSessionToken(payload);
  await setSessionCookie(token);

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    },
    token,
  };
}

export async function loginUser(input: LoginInput): Promise<{
  user: { id: string; email: string; name: string; role: "USER" | "ADMIN" };
  token: string;
}> {
  const validated = loginSchema.parse(input);

  const user = await db.query.users.findFirst({
    where: eq(users.email, validated.email.toLowerCase()),
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isValidPassword = await comparePassword(validated.password, user.passwordHash);
  if (!isValidPassword) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const payload: UserSessionPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const token = await createSessionToken(payload);
  await setSessionCookie(token);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
  };
}

export async function logoutUser(): Promise<void> {
  await clearSessionCookie();
}

export async function getCurrentSession(): Promise<UserSessionPayload | null> {
  return getSession();
}
