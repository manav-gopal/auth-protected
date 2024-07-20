import authRouter from "@/server/auth-route";
import {
  getCategoriesHandler,
  getMeHandler,
  InterestsCategorriesHandler,
} from "@/server/user-controller";
import { createContext } from "@/utils/trpc-context";
import { protectedProcedure, t } from "@/utils/trpc-server";
import { z } from "zod";

const healthCheckerRouter = t.router({
  healthchecker: t.procedure.query(() => {
    return {
      status: "success",
      message: "Routers Seems To be working and in good condition.",
    };
  }),
});

const userRouter = t.router({
  getMe: protectedProcedure.query(({ ctx }) => getMeHandler({ ctx })),
  getCategoriesRouter: protectedProcedure
    .input(z.object({ limit: z.number(), offset: z.number() }))
    .query(({ input, ctx }) => getCategoriesHandler({ input, ctx })),
  updateUserInterests: protectedProcedure
    .input(z.object({ categoryId: z.string(), interested: z.boolean() }))
    .mutation(({ input, ctx }) => InterestsCategorriesHandler({ input, ctx })),
});

export const appRouter = t.mergeRouters(
  healthCheckerRouter,
  authRouter,
  userRouter,
);

export const createCaller = t.createCallerFactory(appRouter);

export const createAsyncCaller = async () => {
  const context = await createContext();
  return createCaller(context);
};

export type AppRouter = typeof appRouter;
