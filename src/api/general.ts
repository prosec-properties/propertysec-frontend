import { IApiResponse } from "@/interface/general";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type ICachedRequest =
  | "no-cache"
  | "default"
  | "reload"
  | "force-cache"
  | "only-if-cached";

export function getApiUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_PRO_SEC_URL}${path}`;
}

class BaseRequest {
  protected async fetchRequest(
    path: string,
    options: RequestInit
  ): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(getApiUrl(path), {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }
      return response;
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out");
      }
      if (error.code === "UND_ERR_HEADERS_TIMEOUT") {
        throw new Error("Server response headers timeout");
      }
      throw error;
    }
  }
}

class UnAuthenticatedRequest extends BaseRequest {
  private async requestWithoutAuth(
    path: string,
    method: HttpMethod = "GET",
    payload?: any,
    cache: ICachedRequest = "no-cache",
    next?: NextFetchRequestConfig | undefined
  ): Promise<Response> {
    try {
      return this.fetchRequest(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method !== "GET" ? JSON.stringify(payload) : undefined,
        cache,
        next,
      });
    } catch (error) {
      throw error;
    }
  }

  private async requestWithoutAuthForm(
    path: string,
    method: "POST" | "PUT" | "PATCH" = "POST",
    payload?: FormData
  ): Promise<Response> {
    try {
      return this.fetchRequest(path, {
        method,
        body: payload,
      });
    } catch (error) {
      throw error;
    }
  }

  async get<T>(
    path: string,
    cache?: ICachedRequest,
    next?: NextFetchRequestConfig
  ): Promise<IApiResponse<T> | null> {
    try {
      const response = await this.requestWithoutAuth(
        path,
        "GET",
        undefined,
        cache,
        next
      );
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async post<T>(path: string, payload: any): Promise<IApiResponse<T> | null> {
    try {
      const response = await this.requestWithoutAuth(path, "POST", payload);
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async put<T>(path: string, payload: any): Promise<IApiResponse<T> | null> {
    try {
      const response = await this.requestWithoutAuth(path, "PUT", payload);
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async patch<T>(path: string, payload: any): Promise<IApiResponse<T> | null> {
    try {
      const response = await this.requestWithoutAuth(path, "PATCH", payload);
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async delete<T>(path: string): Promise<IApiResponse<T> | null> {
    try {
      const response = await this.requestWithoutAuth(path, "DELETE");
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async form<T>(
    path: string,
    payload: FormData,
    method: "POST" | "PUT" | "PATCH"
  ): Promise<IApiResponse<T> | null> {
    try {
      const response = await this.requestWithoutAuthForm(path, method, payload);
      return response.json();
    } catch (error) {
      throw error;
    }
  }
}

class AuthenticatedRequest extends BaseRequest {
  private async requestWithAuth({
    path,
    token,
    method = "GET",
    cache = "default",
    payload,
    next,
  }: {
    path: string;
    token: string;
    method: HttpMethod;
    cache?: ICachedRequest;
    payload?: any;
    next?: NextFetchRequestConfig | undefined;
  }): Promise<Response> {
    try {
      return this.fetchRequest(path, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: method !== "GET" ? JSON.stringify(payload) : undefined,
        cache,
        next,
      });
    } catch (error) {
      throw error;
    }
  }

  private async requestWithAuthForm(
    path: string,
    method: "POST" | "PUT" | "PATCH" = "POST",
    token: string,
    payload: FormData
  ): Promise<Response> {
    try {
      return this.fetchRequestWithExtendedTimeout(path, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });
    } catch (error) {
      throw error;
    }
  }

  protected async fetchRequestWithExtendedTimeout(
    path: string,
    options: RequestInit
  ): Promise<Response> {
    try {
      const controller = new AbortController();
      // Extend timeout to 5 minutes for file uploads
      const timeoutId = setTimeout(() => controller.abort(), 300000);

      const response = await fetch(getApiUrl(path), {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }
      return response;
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out");
      }
      if (error.code === "UND_ERR_HEADERS_TIMEOUT") {
        throw new Error("Server response headers timeout");
      }
      throw error;
    }
  }

  async get<T>(
    path: string,
    token: string,
    cache?: ICachedRequest,
    next?: NextFetchRequestConfig
  ): Promise<IApiResponse<T> | null> {
    try {
      const response = await this.requestWithAuth({
        path,
        token,
        method: "GET",
        cache,
        next,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async post<T>(
    path: string,
    token: string,
    payload?: any
  ): Promise<IApiResponse<T> | null> {
    try {
      const response = await this.requestWithAuth({
        path,
        token,
        method: "POST",
        payload,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async put<T>(
    path: string,
    token: string,
    payload: Record<string, any>
  ): Promise<IApiResponse<T> | null> {
    try {
      const response = await this.requestWithAuth({
        path,
        token,
        method: "PUT",
        payload,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
  async patch<T>(
    path: string,
    token: string,
    payload: Record<string, any>
  ): Promise<IApiResponse<T> | null> {
    try {
      const response = await this.requestWithAuth({
        path,
        token,
        method: "PATCH",
        payload,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async delete<T>(
    path: string,
    token: string
  ): Promise<IApiResponse<T> | null> {
    try {
      const response = await this.requestWithAuth({
        path,
        token,
        method: "DELETE",
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async postFormData<T>(
    path: string,
    token: string,
    payload: FormData
  ): Promise<IApiResponse<T> | null> {
    try {
      const response = await this.requestWithAuthForm(
        path,
        "POST",
        token,
        payload
      );
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async putFormData<T>(
    path: string,
    token: string,
    payload: FormData
  ): Promise<IApiResponse<T> | null> {
    try {
      const response = await this.requestWithAuthForm(
        path,
        "PATCH",
        token,
        payload
      );
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export const $requestWithoutToken = new UnAuthenticatedRequest();
export const $requestWithToken = new AuthenticatedRequest();
