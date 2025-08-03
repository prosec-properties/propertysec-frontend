import VerifyEmail from "@/components/forms/VerifyEmail";
import { SIGN_IN_ROUTE } from "@/constants/routes";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Verify Email",
};

interface ISearchParams {
  email?: string;
}

export default async function Page(
  props: {
    searchParams: Promise<ISearchParams>;
  }
) {
  const searchParams = await props.searchParams;
  const email = searchParams?.email;

  if (!email) {
    redirect(SIGN_IN_ROUTE);
  }

  return (
    <div className="flex justify-center min-h-screen">
      <VerifyEmail email={email} />
    </div>
  );
}
