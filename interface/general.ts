export interface IApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface IMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
  firstPage: number;
  firstPageUrl: string;
  lastPageUrl: string;
  nextPageUrl: string | null;
  previousPageUrl: string | null;
}

export type ICachedRequest =
  | "no-cache"
  | "default"
  | "reload"
  | "force-cache"
  | "only-if-cached";

export type IFetchOptions = {
  cache?: ICachedRequest;
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};
