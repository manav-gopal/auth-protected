import {
  createUserSchema,
  loginUserSchema,
  verifyUserSchema,
} from "@/lib/user-schema";
import { protectedProcedure, pubicProcedure, t } from "@/utils/trpc-server";
import {
  loginHandler,
  logoutHandler,
  registerHandler,
  verifyHandler,
} from "./auth-controller";

const authRouter = t.router({
  registerUser: pubicProcedure
    .input(createUserSchema)
    .mutation(({ input }) => registerHandler({ input })),
  verifyUser: pubicProcedure
    .input(verifyUserSchema)
    .mutation(({ input }) => verifyHandler({ input })),
  loginUser: pubicProcedure
    .input(loginUserSchema)
    .mutation(({ input }) => loginHandler({ input })),
  logoutUser: protectedProcedure.mutation(() => logoutHandler()),
});

export default authRouter;
