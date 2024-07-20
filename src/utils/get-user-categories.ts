"use server";

import { createAsyncCaller } from "@/app/api/trpc/trpc-router";

interface InterestItem {
  id: string; // Changed to string to match the provided data
  name: string;
  interested: boolean; // Fixed typo from 'intrested' to 'interested'
}

interface InterestsObject {
  totalCount: number;
  categories: InterestItem[];
}

function isValidInterestItem(item: any): item is InterestItem {
  return (
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.interested === "boolean"
  );
}

function isValidInterestsObject(obj: any): obj is InterestsObject {
  return (
    typeof obj === "object" &&
    typeof obj.totalCount === "number" &&
    Array.isArray(obj.categories) &&
    obj.categories.every(isValidInterestItem)
  );
}

export const getCategories = async (
  limit: number,
  offset: number,
): Promise<InterestsObject | null> => {
  const caller = await createAsyncCaller();
  try {
    const result = await caller.getCategoriesRouter({ limit, offset });
    const interests = result.data;

    if (isValidInterestsObject(interests)) {
      return interests;
    } else {
      console.error("Invalid interests data structure:", interests);
      return null;
    }
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return null;
  }
};
