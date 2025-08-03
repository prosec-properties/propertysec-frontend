import ForgotPasswordForm from "@/components/forms/ForgotPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
};

export default function Page() {
  return (
    <div className="flex justify-center min-h-screen">
      <ForgotPasswordForm  />
    </div>
  );
}
