import { toast } from "@/components/ui/use-toast";
import { IBackendValidationError } from "../../interface/auth";

export const showToaster = (
  message: string | any,
  variant: "destructive" | "success" | "warning" | "default"
) => {
  let cleanMessage: string;
  
  if (typeof message === "string") {
    cleanMessage = message;
  } else if (message && typeof message === "object") {
    cleanMessage = extractServerErrorMessage(message);
  } else {
    cleanMessage = "Something went wrong. Please try again.";
  }
  
  console.log("showToaster", cleanMessage, variant);
  toast({
    title: cleanMessage,
    variant,
  });
  console.log("showToaster after", cleanMessage, variant);
};

export const checkIfInputNumber = (value: string): boolean => {
  if (!value) return false;
  return !isNaN(Number(value));
};

export const backendValidationError = <T>(errorData: any) => {
  if (!errorData || !errorData.errors || !Array.isArray(errorData.errors))
    return "invalid";

  const errorMsgsArr = {
    field: "" as T,
    message: "",
    rule: "",
  };

  if (Array.isArray(errorData.errors)) {
    const errors = errorData.errors as IBackendValidationError[];

    errors.forEach((error) => {
      if (!error.field) {
        showToaster(error.message, "destructive");
        return;
      }

      errorMsgsArr.field = error.field as T;
      errorMsgsArr.message = error.message;
      errorMsgsArr.rule = error.rule;
    });

    return errorMsgsArr;
  }
};

export function isOdd(number: number): boolean {
  return number % 2 !== 0;
}

export function createFormData(data: Record<string, any>): FormData {
  const formData = new FormData();

  for (const key of Object.keys(data)) {
    const value = data[key];

    if (value === null || value === undefined) {
      continue;
    }

    if (
      ["approvalAgreement", "identificationCard", "powerOfAttorney"].includes(
        key
      ) &&
      Array.isArray(value)
    ) {
      for (const item of value) {
        if (item !== null && item !== undefined) {
          formData.append(key, item);
        }
      }
    } else {
      formData.append(key, value);
    }
  }

  return formData;
}

export const extractServerErrorMessage = (error: any): string => {
  const defaultErrorMessage = "Something went wrong. Please try again.";

  if (!error) return defaultErrorMessage;

  if (typeof error === "string") {
    return error || defaultErrorMessage;
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (Array.isArray(error.errors)) {
    const firstError = error.errors[0];
    if (firstError?.message) {
      return firstError.message;
    }
  }

  if (error.errors && typeof error.errors === "object") {
    const firstErrorKey = Object.keys(error.errors)[0];
    const firstError = error.errors[firstErrorKey];
    if (Array.isArray(firstError) && firstError[0]) {
      return firstError[0];
    }
    if (typeof firstError === "string") {
      return firstError;
    }
  }

  if (error.message && typeof error.message === "string") {
    return error.message;
  }

  if (error.name === "AbortError") {
    return "Request timed out. Please try again.";
  }

  if (error.name === "TypeError" && error.message?.includes("fetch")) {
    return "Network error. Please check your connection and try again.";
  }

  if (error.status) {
    switch (error.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "You are not authorized. Please log in again.";
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return "The requested resource was not found.";
      case 409:
        return "There was a conflict with your request.";
      case 422:
        return "Invalid data provided. Please check your input.";
      case 429:
        return "Too many requests. Please wait a moment and try again.";
      case 500:
        return "Server error. Please try again later.";
      case 502:
      case 503:
        return "Service temporarily unavailable. Please try again later.";
      default:
        return defaultErrorMessage;
    }
  }

  return defaultErrorMessage;
};

export const isNotAnEmptyArray = <T>(arr: T[]): boolean => {
  return arr && Array.isArray(arr) && arr.length > 0;
};

export const extractNumFromString = (str: string): number => {
  return parseInt(str.replace(/\D/g, ""));
};

export const validateNigerianPhoneNumber = (phoneNumber: string): boolean => {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "");

  // Nigerian phone number patterns:
  // - 070, 080, 081, 090, 091 followed by 8 digits (10 digits total)
  // - 23470, 23480, 23481, 23490, 23491 followed by 8 digits (13 digits total)
  // - +23470, +23480, +23481, +23490, +23491 followed by 8 digits (14 digits with +)

  // Check for local numbers (070..., 080..., etc.)
  if (/^[0][7-9][01]\d{8}$/.test(cleaned)) {
    return true;
  }

  // Check for international format without + (234...)
  if (/^234[7-9][01]\d{8}$/.test(cleaned)) {
    return true;
  }

  // Check for international format with + (+234...)
  if (/^\+234[7-9][01]\d{8}$/.test(phoneNumber)) {
    return true;
  }

  return false;
};

export const addParamsToUrl = (url: string, data: Record<string, any>) => {
  const params = new URLSearchParams();
  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value !== undefined) {
      params.append(key, String(value));
    }
  });
  const urlString = url.replace(/\?/g, "");
  return urlString + (params.toString() ? "?" + params.toString() : "");
};

export const cleanServerData = (data: any) => {
  return JSON.parse(JSON.stringify(data));
};

export const formatServerError = (error: any) => {
  const errorMessage = extractServerErrorMessage(error);
  
  return cleanServerData({
    hasError: true,
    message: errorMessage,
    originalError: process.env.NODE_ENV === 'development' ? (error.response || error) : undefined,
  });
};

interface ServerResponse {
  hasError?: boolean;
  [key: string]: any;
}

export const verifyServerResponse = ({ hasError, ...rest }: ServerResponse) => {
  if (hasError) {
    throw rest;
  }
};

export const handleServerError = (error: any) => {
  const message = extractServerErrorMessage(error);
  
  return {
    hasError: true,
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { originalError: error })
  };
};