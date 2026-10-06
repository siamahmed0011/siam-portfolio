import "dotenv/config";

import { hashPassword } from "better-auth/crypto";

import prisma from "../src/lib/prisma";

function hasAdminRole(role?: string | null): boolean {
  if (!role) return false;

  return role
    .split(",")
    .map((item) => item.trim())
    .includes("admin");
}

function addAdminRole(role?: string | null): string {
  if (!role) return "admin";

  const roles = role
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!roles.includes("admin")) {
    roles.push("admin");
  }

  return roles.join(",");
}

async function bootstrapAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "Administrator";

  const shouldResetPassword =
    process.argv.includes("--reset-password");

  if (!email) {
    throw new Error(
      "ADMIN_EMAIL environment variable is required.",
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: {
      accounts: true,
    },
  });

  /*
   * Existing user
   */
  if (existingUser) {
    const credentialAccount = existingUser.accounts.find(
      (account) => account.providerId === "credential",
    );

    /*
     * Ensure the user has administrator authorization
     * without destroying any existing roles.
     */
    if (!hasAdminRole(existingUser.role)) {
      await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          role: addAdminRole(existingUser.role),
        },
      });

      console.log(
        `Administrator role enabled for "${email}".`,
      );
    }

    /*
     * Existing credential account:
     * normal bootstrap must NEVER change the password.
     */
    if (credentialAccount && !shouldResetPassword) {
      console.log(
        `Administrator "${email}" already exists. Password was not modified.`,
      );

      return;
    }

    /*
     * Credential account is missing.
     *
     * This is not considered a password reset because
     * there is no credential password to overwrite.
     */
    if (!credentialAccount) {
      if (!password) {
        throw new Error(
          "The administrator exists but has no credential account. Temporarily provide ADMIN_PASSWORD to create one.",
        );
      }

      const hashedPassword = await hashPassword(password);

      await prisma.account.create({
        data: {
          userId: existingUser.id,
          accountId: existingUser.id,
          providerId: "credential",
          password: hashedPassword,
        },
      });

      console.log(
        `Credential account created for administrator "${email}".`,
      );

      return;
    }

    /*
     * Explicit password reset only.
     */
    if (shouldResetPassword) {
      if (!password) {
        throw new Error(
          "ADMIN_PASSWORD is required when using --reset-password.",
        );
      }

      const hashedPassword = await hashPassword(password);

      await prisma.account.update({
        where: {
          id: credentialAccount.id,
        },
        data: {
          password: hashedPassword,
          accountId: existingUser.id,
        },
      });

      console.log(
        `Administrator "${email}" password reset successfully.`,
      );

      return;
    }

    return;
  }

  /*
   * New administrator
   */
  if (!password) {
    throw new Error(
      "ADMIN_PASSWORD is required to create a new administrator.",
    );
  }

  const hashedPassword = await hashPassword(password);

  /*
   * Use a transaction so we never leave an orphan User
   * if credential-account creation fails.
   */
  const newUser = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        name,
        role: "admin",
        emailVerified: true,
      },
    });

    await tx.account.create({
      data: {
        userId: user.id,
        accountId: user.id,
        providerId: "credential",
        password: hashedPassword,
      },
    });

    return user;
  });

  console.log(
    `Administrator "${newUser.email}" bootstrapped successfully.`,
  );
}

bootstrapAdmin()
  .catch((error: unknown) => {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown bootstrap error.";

    console.error(`Administrator bootstrap failed: ${message}`);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });