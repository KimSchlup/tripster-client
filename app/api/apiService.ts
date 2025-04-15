import { getApiDomain } from "@/utils/domain";
import { ApplicationError } from "@/types/error";

export class ApiService {
  private baseURL: string;
  //private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL = getApiDomain();
    /*this.defaultHeaders = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Authorization": localStorage.getItem("token") || "",
    };*/
  }

  private defaultHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };
    
    try {
      // Get token from localStorage directly
      const token = localStorage.getItem("token");
      console.log("Raw token from localStorage:", token);
      
      // Only add Authorization header if token exists and is not empty
      if (token && token !== "" && token !== "null" && token !== "undefined") {
        // Remove any quotes that might be wrapping the token
        let cleanToken = token;
        if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
          cleanToken = cleanToken.slice(1, -1);
        }
        
        console.log("Clean token being used in header:", cleanToken);
        headers["Authorization"] = cleanToken;
      } else {
        console.warn("No valid token found for Authorization header");
      }
    } catch (error) {
      console.error("Error accessing token:", error);
    }
    
    console.log("Final headers:", headers);
    return headers;
  }

  /**
   * Helper function to check the response, parse JSON,
   * and throw an error if the response is not OK.
   *
   * @param res - The response from fetch.
   * @param errorMessage - A descriptive error message for this call.
   * @returns Parsed JSON data.
   * @throws ApplicationError if res.ok is false.
   */
  private async processResponse<T>(
      res: Response,
      errorMessage: string,
  ): Promise<T> {
    if (!res.ok) {
      let errorDetail = res.statusText;
      try {
        const contentType = res.headers.get("Content-Type") || "";
        console.log("Error response content type:", contentType);
        
        // Log the raw response for debugging
        const rawResponse = await res.text();
        console.log("Raw error response:", rawResponse);
        
        // Try to parse as JSON if appropriate
        if (contentType.includes("application/json")) {
          try {
            const errorInfo = JSON.parse(rawResponse);
            console.log("Parsed error info:", errorInfo);
            if (errorInfo?.message) {
              errorDetail = errorInfo.message;
            } else {
              errorDetail = JSON.stringify(errorInfo);
            }
          } catch (parseError) {
            console.error("Error parsing JSON response:", parseError);
            errorDetail = rawResponse;
          }
        } else {
          errorDetail = rawResponse;
        }
      } catch (error) {
        console.error("Error processing response:", error);
        // Falls JSON-Parsing und Text-Fallback fehlschlagen, bleibt res.statusText.
      }
      const detailedMessage = `${errorMessage} (${res.status}: ${errorDetail})`;
      console.error("Detailed error message:", detailedMessage);
      
      const error: ApplicationError = new Error(
          detailedMessage,
      ) as ApplicationError;
      error.info = JSON.stringify(
          { status: res.status, statusText: res.statusText },
          null,
          2,
      );
      error.status = res.status;
      throw error;
    }
    return res.headers.get("Content-Type")?.includes("application/json")
        ? res.json() as Promise<T>
        : Promise.resolve(res as T);
  }

  /**
   * GET request.
   * @param endpoint - The API endpoint (e.g. "/users").
   * @returns JSON data of type T.
   */
  public async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const res = await fetch(url, {
      method: "GET",
      headers: this.defaultHeaders(),
    });
    console.log(this.defaultHeaders)
    return this.processResponse<T>(
        res,
        "An error occurred while fetching the data.\n",
    );
  }

  /**
   * POST request.
   * @param endpoint - The API endpoint (e.g. "/users").
   * @param data - The payload to post.
   * @param options - Optional configuration for the request.
   * @returns JSON data of type T.
   */
  public async post<T>(endpoint: string, data: unknown, options?: { headers?: HeadersInit }): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Merge default headers with any provided headers
    const headers = {
      ...this.defaultHeaders(),
      ...(options?.headers || {})
    };
    
    console.log(`POST request to ${endpoint} with headers:`, headers);
    
    const res = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });
    return this.processResponse<T>(
        res,
        "An error occurred while posting the data.\n",
    );
  }

  /**
   * PUT request.
   * @param endpoint - The API endpoint (e.g. "/users/123").
   * @param data - The payload to update.
   * @returns JSON data of type T.
   */
  public async put<T>(endpoint: string, data: unknown): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: this.defaultHeaders(),
      body: JSON.stringify(data),
    });
    return this.processResponse<T>(
        res,
        "An error occurred while updating the data.\n",
    );
  }

  /**
   * DELETE request.
   * @param endpoint - The API endpoint (e.g. "/users/123").
   * @returns JSON data of type T.
   */
  public async delete<T>(endpoint: string): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const res = await fetch(url, {
      method: "DELETE",
      headers: this.defaultHeaders(),
    });
    return this.processResponse<T>(
        res,
        "An error occurred while deleting the data.\n",
    );
  }
}
