// utils/update-user-interests.ts
"use server";

import { createAsyncCaller } from "@/app/api/trpc/trpc-router";

export const updateUserInterests = async (input: {
  categoryId: string;
  interested: boolean;
}) => {
  const caller = await createAsyncCaller();
  try {
    await caller.updateUserInterests(input);
  } catch (e: any) {
    console.error("Failed to update user interests:", e);
    // Handle error (e.g., show a notification to the user)
  }
};
