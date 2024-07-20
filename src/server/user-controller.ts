import { type Context } from "@/utils/trpc-context";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/lib/prisma";

export const getMeHandler = async ({ ctx }: { ctx: Context }) => {
  try {
    const { user } = ctx;
    return {
      status: "success",
      data: {
        user,
      },
    };
  } catch (err: any) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err.message,
    });
  }
};

export const getCategoriesHandler = async ({
  input,
  ctx,
}: {
  input: { limit: number; offset: number };
  ctx: Context;
}) => {
  try {
    const { user } = ctx;

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    const totalCount = await prisma.categories.count();

    const categories = await prisma.categories.findMany({
      skip: input.offset,
      take: input.limit,
      include: {
        interests: {
          where: {
            userId: user.id,
          },
        },
      },
    });

    const result = categories.map((category) => ({
      id: category.id,
      name: category.name,
      interested: category.interests.length > 0,
    }));

    return {
      status: "success",
      data: {
        totalCount: totalCount,
        categories: result,
      },
    };
  } catch (err: any) {
    if (err instanceof TRPCError) {
      throw err;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err.message,
      cause: "Error while fetching Interest data",
    });
  }
};

export const InterestsCategorriesHandler = async ({
  input,
  ctx,
}: {
  input: { categoryId: string; interested: boolean };
  ctx: Context;
}) => {
  try {
    const { user } = ctx;

    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    if (input.interested) {
      await prisma.interestedCategories.upsert({
        where: {
          userId_categoryId: {
            userId: user.id,
            categoryId: input.categoryId,
          },
        },
        update: {},
        create: {
          userId: user.id,
          categoryId: input.categoryId,
        },
      });
    } else {
      await prisma.interestedCategories.delete({
        where: {
          userId_categoryId: {
            userId: user.id,
            categoryId: input.categoryId,
          },
        },
      });
    }

    return {
      status: "success",
      message: "User interests updated successfully",
    };
  } catch (err: any) {
    if (err instanceof TRPCError) {
      throw err;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: err.message,
      cause: "Error while updating user interests",
    });
  }
};
