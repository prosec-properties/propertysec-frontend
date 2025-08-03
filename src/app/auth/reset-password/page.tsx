import ResetPasswordForm from "@/components/forms/ResetPassword";
import { SIGN_IN_ROUTE } from "@/constants/routes";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Reset Password",
};

interface ISearchParams {
  email?: string;
  token?: string;
}

export default async function Page(
  props: {
    searchParams: Promise<ISearchParams>;
  }
) {
  const searchParams = await props.searchParams;
  const email = searchParams?.email;
  const token = searchParams?.token;

  if (!email || !token) {
    redirect(SIGN_IN_ROUTE);
  }

  return (
    <div className="flex justify-center min-h-screen">
      <ResetPasswordForm token={token} email={email} />
    </div>
  );
}
