"use server";

import { revalidateTag } from "next/cache";

export const revalidateCacheTags = async (tags: string[]) => {
  tags.forEach((tag) => {
    if (tag) {
      revalidateTag(tag);
    }
  });
};
