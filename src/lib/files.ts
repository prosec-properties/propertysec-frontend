import { ACCEPTED_VIDEO_EXTENSIONS, ACCEPTED_VIDEO_TYPES } from "@/constants/files";
import { IPropertyFileRecord } from "@/interface/property";

/**
 * Converts bytes to megabytes with specified decimal places
 * @param bytes - The size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with MB suffix
 */
export function convertBytesToMB(bytes: number, decimals: number = 2): string {
  if (typeof bytes !== "number" || bytes < 0) {
    throw new Error("Bytes must be a positive number");
  }

  if (bytes === 0) return "0 MB";

  const MB = bytes / (1024 * 1024);
  return `${MB.toFixed(decimals)} MB`;
}

/**
 * Checks if a file's size exceeds the specified limit in MB
 * @param file - The File object to check
 * @param sizeInMB - Maximum allowed size in megabytes
 * @returns Boolean indicating if file exceeds size limit
 */
export function isFileSizeGreaterThan(file: File, sizeInMB: number): boolean {
  if (!(file instanceof File)) {
    throw new Error("First argument must be a File object");
  }

  if (typeof sizeInMB !== "number" || sizeInMB <= 0) {
    throw new Error("Size limit must be a positive number");
  }

  const fileSizeInMB = file.size / (1024 * 1024);
  return fileSizeInMB > sizeInMB;
}

/**
 * Downloads a PDF file from a URL or base64 data
 * @param params - Object containing fileName and url
 * @param params.fileName - Name for the downloaded file
 * @param params.url - URL or base64 string of the PDF
 */
export function downloadPdf({
  fileName,
  url,
}: {
  fileName: string;
  url: string;
}): void {
  if (!fileName || !url) {
    throw new Error("Both fileName and url are required");
  }

  try {
    let downloadUrl = url;

    // Handle base64 PDF data
    if (url.startsWith("data:application/pdf;base64,")) {
      const base64Data = url.split(",")[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      downloadUrl = URL.createObjectURL(blob);
    }

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${fileName}.pdf`;
    console.log("Download link created:", link);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up object URL if we created one
    if (downloadUrl !== url) {
      URL.revokeObjectURL(downloadUrl);
    }
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw new Error("Failed to download PDF");
  }
}

/**
 * Generates a standardized invoice PDF filename
 * @param params - Object containing invoice details
 * @param params.planName - Name of the subscription plan
 * @param params.planDuration - Duration of the plan in months
 * @param params.reference - Payment reference number
 * @returns Formatted filename string
 */
export function generateInvoicePdfName({
  planName = "unknown-plan",
  planDuration = "0",
  reference = "unknown-ref",
}: {
  planName?: string;
  planDuration?: string | number;
  reference?: string;
}): string {
  // Clean and format the inputs
  const cleanPlanName = planName.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase();
  const cleanDuration = String(planDuration).replace(/\D/g, "");
  const cleanReference = reference.replace(/[^a-zA-Z0-9]/g, "-");

  return `propertysec-ng-invoice-${cleanPlanName}-${cleanDuration}months-${cleanReference}`;
}

export const isVideoFile = (file: IPropertyFileRecord): boolean => {


  if (file.fileType === "video") return true;

  const fileExtension = file.fileName.toLowerCase().split(".").pop();
  if (fileExtension && ACCEPTED_VIDEO_EXTENSIONS.includes(`.${fileExtension}`))
    return true;

  if (typeof file.meta === "string") {
    try {
      const meta = JSON.parse(file.meta);
      if (meta.type && ACCEPTED_VIDEO_TYPES.includes(meta.type)) return true;
    } catch (e) {
      console.error("Error parsing file meta:", e);
    }
  } else if (file.meta && typeof file.meta === "object" && file.meta.type) {
    if (ACCEPTED_VIDEO_TYPES.includes(file.meta.type)) return true;
  }

  return false;
};
