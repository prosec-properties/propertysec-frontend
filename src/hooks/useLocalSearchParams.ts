import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export const useLocalSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setSearchParams = (searchTerm: string, item: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(searchTerm || "item", item);

    router.push(`${pathname}?${params.toString()}`);
  };

  const getSearchParams = (searchTerm: string) => {
    return searchParams.get(searchTerm);
  };

  const deleteSearchParams = (searchTerm: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(searchTerm);
    router.push(`${pathname}?${params.toString()}`);
  };

  return { setSearchParams, getSearchParams, deleteSearchParams };
};
