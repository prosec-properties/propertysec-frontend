import RegisterForm from "@/components/forms/Register";
import { TanstackProviders } from "@/components/misc/TanstackProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <div className="flex justify-center min-h-screen">
      <RegisterForm />
    </div>
  );
}
