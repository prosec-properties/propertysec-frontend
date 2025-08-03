type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export function getApiUrl(path: string) {
  return process.env.NEXT_PUBLIC_PRO_SEC_URL + path;
}

class UnAuthenticatedRequest {
  private async requestWithoutAuthForm(
    path: string,
    method: "POST" | "PUT" = "POST",
    payload?: FormData
  ) {
    const request = await fetch(getApiUrl(path), {
      method: method,
      body: payload,
    });

    return request;
  }

  private async requestWithoutAuth(
    path: string,
    method: HttpMethod = "GET",
    payload?: any
  ) {
    const request = await fetch(getApiUrl(path), {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: method !== "GET" ? JSON.stringify(payload) : undefined,
    });

    return request;
  }

  async get(path: string): Promise<Response> {
    return this.requestWithoutAuth(path, "GET");
  }

  async post(path: string, payload: any): Promise<Response> {
    return await this.requestWithoutAuth(path, "POST", payload);
  }

  async put(path: string, payload: any): Promise<Response> {
    return this.requestWithoutAuth(path, "PUT", payload);
  }

  async delete(path: string): Promise<Response> {
    return this.requestWithoutAuth(path, "DELETE");
  }

  async form(
    path: string,
    payload: FormData,
    method: "POST" | "PUT"
  ): Promise<Response> {
    return this.requestWithoutAuthForm(path, method, payload);
  }
}

class AuthenticatedRequest {
  private async requestWithAuthForm(
    path: string,
    method: "POST" | "PUT" = "POST",
    token: string,
    payload?: FormData
  ) {
    const request = await fetch(getApiUrl(path), {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    });

    return request;
  }

  private async requestWithAuth(
    path: string,
    method: HttpMethod = "GET",
    token: string,
    payload?: any
  ) {
    return await fetch(getApiUrl(path), {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: method !== "GET" ? JSON.stringify(payload) : undefined,
    });
  }

  async get(path: string, token: string): Promise<Response> {
    return this.requestWithAuth(path, "GET", token);
  }

  async post(path: string, token: string, payload: any): Promise<Response> {
    return this.requestWithAuth(path, "POST", token, payload);
  }

  async put(path: string, token: string, payload: any): Promise<Response> {
    return this.requestWithAuth(path, "PUT", token, payload);
  }

  async delete(path: string, token: string): Promise<Response> {
    return this.requestWithAuth(path, "DELETE", token);
  }

  async form(
    path: string,
    token: string,
    payload: FormData,
    method: "POST" | "PUT"
  ): Promise<Response> {
    return this.requestWithAuthForm(path, method, token, payload);
  }
}

export const $requestWithoutToken = new UnAuthenticatedRequest();
export const $requestWithToken = new AuthenticatedRequest();
