"use client";

import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { extractServerErrorMessage } from "@/lib/general";
import { useEffect, useState } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    console.error(error);
    const errMsg =
      extractServerErrorMessage(error) ||
      error.message ||
      "Something went wrong!";
    setErrorMessage(errMsg);
  }, [error]);

  return (
    <div>
      <ErrorDisplay message={errorMessage} onRetry={reset} />
    </div>
  );
}
