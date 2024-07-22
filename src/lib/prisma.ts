import { PrismaClient } from "@prisma/client";

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  }).$extends({
    query: {
      $allOperations({ operation, model, args, query }) {
        const start = performance.now();
        const MAX_TIMEOUT = 5000; // 5 seconds

        const timeout = new Promise<any>((_, reject) => {
          setTimeout(() => reject(new Error('Query timeout')), MAX_TIMEOUT);
        });

        const result = query(args).finally(() => {
          const end = performance.now();
          console.log(`${model}.${operation} took ${end - start}ms`);
        });

        return Promise.race([result, timeout]);
      },
    },
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | ReturnType<typeof createPrismaClient>;
}

const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export { prisma };
