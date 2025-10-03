import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useQueryString() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getQueryParam = useCallback((key: string) => {
    return searchParams.get(key);
  }, [searchParams]);

  const setQueryParam = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`?${params.toString()}`);
  }, [router, searchParams]);

  const deleteQueryParam = useCallback((key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.replace(`?${params.toString()}`);
  }, [router, searchParams]);

  return { getQueryParam, setQueryParam, deleteQueryParam };
}
