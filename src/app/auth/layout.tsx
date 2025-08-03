import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="bg-white md:bg-offWhite min-h-screen pt-16">{children}</div>;
};

export default AuthLayout;
