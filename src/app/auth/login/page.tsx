import LoginForm from "@/components/forms/Login";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <div className="flex justify-center min-h-screen">
      <LoginForm />
    </div>
  );
}
