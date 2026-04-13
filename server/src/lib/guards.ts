import { GraphQLError } from "graphql";
import type { AuthUser } from "./types.js";

/**
 * Asserts that a currentUser exists on the context.
 * Throws a GQL UNAUTHENTICATED error if not.
 * Returns the user so callers can use it without re-checking for null.
 */
export function requireAuth(currentUser: AuthUser | null): AuthUser {
  console.log(currentUser);
  if (!currentUser) {
    throw new GraphQLError("You must be signed in to perform this action.", {
      extensions: { code: "UNAUTHENTICATED", status: 401 },
    });
  }
  return currentUser;
}

/**
 * Asserts that the current user has one of the allowed roles.
 * Call after requireAuth — pass the result of requireAuth as the user arg.
 */
export function requireRole(
  user: AuthUser,
  ...roles: Array<AuthUser["role"]>
): void {
  if (!roles.includes(user.role)) {
    throw new GraphQLError(
      `This action requires one of the following roles: ${roles.join(", ")}.`,
      { extensions: { code: "FORBIDDEN", status: 403 } },
    );
  }
}
