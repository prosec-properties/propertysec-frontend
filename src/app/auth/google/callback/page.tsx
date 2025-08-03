import { $requestWithoutToken } from "@/app/api";
import { Loader } from "lucide-react";
import { Metadata } from "next";
import { signIn } from "next-auth/react";

export const metadata: Metadata = {
  title: "Auth",
};

interface ISearchParams {
  code?: string;
}

export default async function Page(
  props: {
    searchParams: Promise<ISearchParams>;
  }
) {
  const searchParams = await props.searchParams;
  const code = searchParams?.code;

  const user = await $requestWithoutToken.get(`/auth/google/callback?code=${code}`);

  //   signIn("credentials", {

  //   })

  return (
    <div className="flex justify-center items-center min-h-screen">
      <article >
        <Loader className="animate-spin h-20 w-20" />
        <p>Please wait...</p>
      </article>
    </div>
  );
}
