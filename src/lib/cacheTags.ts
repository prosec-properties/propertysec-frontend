import { IFetchOptions } from "@/interface/general";

export const buildNextTags = (
  baseTags: string[],
  options?: IFetchOptions
): NonNullable<IFetchOptions["next"]> => {
  const nextOptions = options?.next;

  if (!nextOptions) {
    return { tags: baseTags };
  }

  return {
    ...nextOptions,
    tags: Array.from(new Set([...baseTags, ...(nextOptions.tags ?? [])])),
  };
};
