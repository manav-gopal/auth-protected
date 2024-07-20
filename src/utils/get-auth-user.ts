"use server";

import { createAsyncCaller } from "@/app/api/trpc/trpc-router";
import { redirect } from "next/navigation";

export const getAuthUser = async ({
  shouldRedirect = true,
}: {
  shouldRedirect?: boolean;
  requireVerified?: boolean;
} = {}) => {
  const caller = await createAsyncCaller();
  try {
    const result = await caller.getMe(undefined);
    const user = result.data.user;

    return user;
  } catch (e: any) {
    if (e.code === "UNAUTHORIZED" && shouldRedirect) {
      redirect("/login");
    }
    return null;
  }
};
