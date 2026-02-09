import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "#shared/generated/prisma/client";

declare const globalThis: typeof global & {
  prisma?: PrismaClient;
};

export function usePrismaClient(): PrismaClient {
  if (globalThis.prisma) {
    return globalThis.prisma;
  }

  const { databaseUrl } = useRuntimeConfig();
  if (!databaseUrl) {
    throw new Error("Database URL is not defined in runtime config");
  }

  const adapter = new PrismaPg({
    connectionString: databaseUrl,
  });

  const prisma = new PrismaClient({
    adapter,
  });

  if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma;
  }

  return prisma;
}

export const prisma = usePrismaClient();
