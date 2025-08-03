import { useRouter, useSearchParams } from "next/navigation";

export function useQueryString() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getQueryParam = (key: string) => {
    return searchParams.get(key);
  };

  const setQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.replace(`?${params.toString()}`);
  };

  const deleteQueryParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.replace(`?${params.toString()}`);
  };

  return { getQueryParam, setQueryParam, deleteQueryParam };
}
