import { TRPCError, initTRPC } from "@trpc/server";
import SuperJSON from "superjson";
import { type ContextType } from "@/utils/trpc-context";

export const t = initTRPC.context<ContextType>().create({
  transformer: SuperJSON,
});

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
      cause: "You must be logged in to access this resource",
    });
  }
  // if (!ctx.user.verified) {
  //   throw new TRPCError({
  //     code: 'FORBIDDEN',
  //     message: 'User Not Verified',
  //     cause: 'User Not Verified'
  //   });
  // }
  return next();
});

export const pubicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
