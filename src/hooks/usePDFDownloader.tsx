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

  const { toPDF, targetRef } = usePDF({ 
    filename: resolveFilename(payload),
    method: 'save',
    page: { 
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      format: 'a4',
      orientation: 'portrait'
    },
    canvas: {
      mimeType: 'image/png',
      qualityRatio: 1
    }
  });

  const download = useCallback(
    async (data: unknown) => {
      setPayload(data);

      // allow DOM to mount/paint - increased delay for complex content
      await new Promise((res) => setTimeout(res, 1000));

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
