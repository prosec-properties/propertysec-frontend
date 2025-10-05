"use client";

import { useCallback, useState } from "react";
import { usePDF } from "react-to-pdf";
import { showToaster } from "@/lib/general";

type FilenameResolver = string | ((payload: unknown) => string);

export function usePDFDownloader(filenameResolver?: FilenameResolver) {
  const [payload, setPayload] = useState<unknown | null>(null);

  const resolveFilename = (p: unknown) => {
    if (typeof filenameResolver === "function") return filenameResolver(p);
    if (typeof filenameResolver === "string") return filenameResolver;
    return "receipt.pdf";
  };

  const { toPDF, targetRef } = usePDF({ filename: resolveFilename(payload) });

  const download = useCallback(
    async (data: unknown) => {
      setPayload(data);

      // allow DOM to mount/paint
      await new Promise((res) => setTimeout(res, 250));

      try {
        if (!toPDF) throw new Error("toPDF is not available");
        await toPDF();
        showToaster("Receipt downloaded", "success");
      } catch (err) {
        console.error("Failed to generate PDF", err);
        showToaster("Failed to generate receipt PDF", "destructive");
        throw err;
      } finally {
        // remove hidden DOM after a short delay to avoid impacting UX
        setTimeout(() => setPayload(null), 800);
      }
    },
    [toPDF]
  );

  return {
    payload,
    setPayload,
    download,
    targetRef,
  } as const;
}
