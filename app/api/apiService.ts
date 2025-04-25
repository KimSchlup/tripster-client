import { getApiDomain } from "@/utils/domain";
import { ApplicationError } from "@/types/error";
import { RouteCreateRequest, TravelMode } from "@/types/routeTypes";
import { retrieveToken } from "@/utils/tokenUtils";

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

  // Checklist API methods
  /**
   * Get the checklist for a roadtrip.
   * @param roadtripId - The ID of the roadtrip.
   * @returns The checklist items.
   */
  public async getChecklist<T>(roadtripId: string | number): Promise<T> {
    console.log(`Getting checklist for roadtrip ID: ${roadtripId}`);
    console.log(`Roadtrip ID type: ${typeof roadtripId}`);
    
    // Ensure roadtripId is properly formatted
    const formattedRoadtripId = typeof roadtripId === 'string' ? parseInt(roadtripId, 10) : roadtripId;
    console.log(`Formatted roadtrip ID: ${formattedRoadtripId}`);
    
    // Add a delay to ensure token is properly set
    console.log("Adding delay before checklist request...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log the token before making the request
    console.log("Token before checklist request:", retrieveToken("token") ? "Found" : "Not found");
    
    // Construct the endpoint according to the backend controller mapping
    // Controller is mapped to "/roadtrips" and the endpoint is "/{roadtripId}/checklist"
    const endpoint = `/roadtrips/${formattedRoadtripId}/checklist`;
    console.log(`Full endpoint: ${endpoint}`);
    console.log(`Full URL: ${this.baseURL}${endpoint}`);
    
    // Log the backend controller mapping for reference
    console.log("Backend controller mapping: @RequestMapping(\"/roadtrips\")");
    console.log("Backend endpoint: @GetMapping(\"/{roadtripId}/checklist\")");
    console.log("No request body, only token in Authorization header");
    
    try {
      // Based on the provided ChecklistGetDTO structure, the endpoint returns an object with:
      // - roadtripId: Long
      // - checklistElements: List<ChecklistElementGetDTO>
      const response = await this.get<Record<string, unknown>>(endpoint);
      
      console.log("Checklist response received successfully");
      console.log("Checklist response type:", typeof response);
      console.log("Checklist response structure:", response ? Object.keys(response) : "No response");
      console.log("Full response:", JSON.stringify(response, null, 2));
      
      // Print the full response data to the terminal for debugging
      console.log("%c CHECKLIST API RESPONSE DATA:", "background: #4CAF50; color: white; font-size: 16px; font-weight: bold; padding: 4px 8px; border-radius: 4px;");
      console.log(response);
      
      if (response && response.checklistElements) {
        console.log("%c CHECKLIST ELEMENTS:", "background: #2196F3; color: white; font-size: 16px; font-weight: bold; padding: 4px 8px; border-radius: 4px;");
        console.log(response.checklistElements);
      }
      
      // If the response is an array, return it directly
      if (Array.isArray(response)) {
        console.log("Response is an array with length:", response.length);
        return response as unknown as T;
      }
      
      // According to the ChecklistGetDTO structure, we should look for the 'checklistElements' property
      if (response && 'checklistElements' in response) {
        if (Array.isArray(response.checklistElements)) {
          console.log("Response has 'checklistElements' array with length:", response.checklistElements.length);
          return response.checklistElements as unknown as T;
        } else if (response.checklistElements === null) {
          console.log("Response has null 'checklistElements', returning empty array");
          return [] as unknown as T;
        }
      }
      
      // For backward compatibility, check other possible property names
      
      // If the response is an object with an 'elements' property
      if (response && response.elements && Array.isArray(response.elements)) {
        console.log("Response has 'elements' array with length:", response.elements.length);
        return response.elements as unknown as T;
      }
      
      // If the response is an object with an 'items' property
      if (response && response.items && Array.isArray(response.items)) {
        console.log("Response has 'items' array with length:", response.items.length);
        return response.items as unknown as T;
      }
      
      // Otherwise, return the response as is
      console.log("Returning response as is");
      return response as unknown as T;
    } catch (error) {
      console.error(`Error in getChecklist for roadtrip ID ${formattedRoadtripId}:`, error);
      console.error(`Full error details:`, error);
      throw error;
    }
  }

  /**
   * Add a new checklist element to a roadtrip.
   * @param roadtripId - The ID of the roadtrip.
   * @param checklistElement - The checklist element to add (ChecklistElementPostDTO).
   * @returns The created checklist element (ChecklistElementGetDTO).
   */
  public async addChecklistElement<T>(roadtripId: string | number, checklistElement: Omit<T, 'checklistItemId'>): Promise<T> {
    console.log(`Adding checklist element to roadtrip ID: ${roadtripId}`);
    console.log("Original checklist element data:", JSON.stringify(checklistElement, null, 2));
    
    // Add a delay to ensure token is properly set
    console.log("Adding delay before checklist element creation...");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log the token before making the request
    const token = retrieveToken("token");
    console.log("Token before checklist element creation:", token ? "Found" : "Not found");
    
    if (!token) {
      console.error("No token found for authorization");
      throw new Error("Authentication required. Please log in again.");
    }
    
    // Format the roadtripId if needed
    const formattedRoadtripId = typeof roadtripId === 'string' ? parseInt(roadtripId, 10) : roadtripId;
    
    // Create a proper ChecklistElementPostDTO object without the roadtripId
    // The backend expects: name, isCompleted, assignedUser, priority, category
    const checklistElementData: Record<string, unknown> = {
      name: (checklistElement as Record<string, unknown>).name || "",
      isCompleted: (checklistElement as Record<string, unknown>).isCompleted === true,
      priority: (checklistElement as Record<string, unknown>).priority || "MEDIUM",
      category: (checklistElement as Record<string, unknown>).category || "ITEM"
    };
    
    // Only include assignedUser if it's not null or empty
    if ((checklistElement as Record<string, unknown>).assignedUser) {
      checklistElementData.assignedUser = (checklistElement as Record<string, unknown>).assignedUser;
    }
    
    // Map the category if it's "TODO" to "TASK" to match backend enum
    if (checklistElementData.category === "TODO") {
      console.log("Mapping category from TODO to TASK to match backend enum");
      checklistElementData.category = "TASK";
    }
    
    // Based on the controller code, we should send a ChecklistElementPostDTO directly
    const endpoint = `/roadtrips/${formattedRoadtripId}/checklist`;
    console.log(`Add checklist element endpoint: ${endpoint}`);
    console.log(`Full URL: ${this.baseURL}${endpoint}`);
    
    // Log the modified request payload
    console.log("Modified request payload:", JSON.stringify(checklistElementData, null, 2));
    
    try {
      // Make the API request with explicit headers to ensure token is sent
      const headers = {
        "Content-Type": "application/json",
        "Authorization": token
      };
      
      console.log("Request headers:", headers);
      
      // Make the API request with explicit headers
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(checklistElementData)
      });
      
      console.log(`Response status: ${response.status} ${response.statusText}`);
      console.log("Response headers:", Object.fromEntries([...response.headers.entries()]));
      
      // Check if the response is OK
      if (!response.ok) {
        let errorDetail = response.statusText;
        try {
          const contentType = response.headers.get("Content-Type") || "";
          console.log("Error response content type:", contentType);
          
          // Log the raw response for debugging
          const rawResponse = await response.text();
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
        }
        
        const detailedMessage = `Error creating checklist item: ${response.status}: ${errorDetail}`;
        console.error(detailedMessage);
        throw new Error(detailedMessage);
      }
      
      // Handle empty responses (e.g., 204 No Content)
      if (response.status === 204 || response.headers.get("Content-Length") === "0") {
        console.log("Empty response received, creating default item");
        
        // Create a default response with the data we sent
        const defaultResponse = {
          checklistItemId: Date.now(), // Generate a temporary ID
          ...checklistElementData,
          roadtripId: formattedRoadtripId
        };
        
        console.log("Created default response:", defaultResponse);
        return defaultResponse as unknown as T;
      }
      
      // Parse the JSON response
      let responseData;
      try {
        const contentType = response.headers.get("Content-Type") || "";
        if (contentType.includes("application/json")) {
          responseData = await response.json();
          console.log("Parsed JSON response:", responseData);
        } else {
          const textResponse = await response.text();
          console.log("Text response:", textResponse);
          try {
            // Try to parse as JSON anyway
            responseData = JSON.parse(textResponse);
            console.log("Parsed text as JSON:", responseData);
          } catch {
            console.log("Could not parse text as JSON, using default response");
            // Create a default response with the data we sent
            responseData = {
              checklistItemId: Date.now(), // Generate a temporary ID
              ...checklistElementData,
              roadtripId: formattedRoadtripId
            };
          }
        }
      } catch (error) {
        console.error("Error parsing response:", error);
        // Create a default response with the data we sent
        responseData = {
          checklistItemId: Date.now(), // Generate a temporary ID
          ...checklistElementData,
          roadtripId: formattedRoadtripId
        };
      }
      
      console.log("Final response data:", responseData);
      
      // The backend returns a ChecklistElementGetDTO
      // Try to adapt the response to match our frontend model
      
      // Case 1: Response already has checklistElementId
      if (responseData && responseData.checklistElementId) {
        console.log("Response has checklistElementId:", responseData.checklistElementId);
        
        // Map checklistElementId to checklistItemId
        const adaptedResponse = {
          ...responseData,
          checklistItemId: responseData.checklistElementId,
          roadtripId: formattedRoadtripId
        };
        
        console.log("Adapted response with checklistElementId:", adaptedResponse);
        return adaptedResponse as unknown as T;
      } 
      // Case 2: Response has id instead of checklistElementId
      else if (responseData && responseData.id) {
        console.log("Response has id:", responseData.id);
        
        const adaptedResponse = {
          ...responseData,
          checklistItemId: responseData.id,
          roadtripId: formattedRoadtripId
        };
        
        console.log("Adapted response with id:", adaptedResponse);
        return adaptedResponse as unknown as T;
      }
      // Case 3: Response is an object but doesn't have expected ID fields
      else if (responseData && typeof responseData === 'object') {
        console.log("Response is an object but doesn't have expected ID fields");
        
        // Try to find any property that might be an ID
        const possibleIdFields = ['checklistElementId', 'id', 'elementId', 'itemId'];
        let idValue = null;
        
        for (const field of possibleIdFields) {
          if (responseData[field] !== undefined) {
            console.log(`Found potential ID field: ${field} with value:`, responseData[field]);
            idValue = responseData[field];
            break;
          }
        }
        
        // If no ID field found, generate a temporary one
        if (idValue === null) {
          idValue = Date.now();
          console.log("No ID field found, generating temporary ID:", idValue);
        }
        
        // Create an adapted response with the necessary fields
        const adaptedResponse = {
          ...responseData,
          checklistItemId: idValue,
          roadtripId: formattedRoadtripId,
          name: responseData.name || checklistElementData.name,
          isCompleted: responseData.isCompleted !== undefined ? responseData.isCompleted : checklistElementData.isCompleted,
          assignedUser: responseData.assignedUser || checklistElementData.assignedUser || null,
          priority: responseData.priority || checklistElementData.priority,
          category: responseData.category || checklistElementData.category
        };
        
        console.log("Fully adapted response:", adaptedResponse);
        return adaptedResponse as unknown as T;
      }
      
      // If we get here, create a default response with the data we sent
      const defaultResponse = {
        checklistItemId: Date.now(), // Generate a temporary ID
        ...checklistElementData,
        roadtripId: formattedRoadtripId
      };
      
      console.log("Created default response as fallback:", defaultResponse);
      return defaultResponse as unknown as T;
    } catch (error) {
      console.error("Error in addChecklistElement:", error);
      
      // Add more detailed error logging
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        
        if ('status' in error) {
          console.error("Error status:", (error as ApplicationError).status);
        }
        
        if ('info' in error) {
          console.error("Error info:", (error as ApplicationError).info);
        }
        
        // If it's a network error, provide more context
        if (error.message.includes('fetch') || error.message.includes('network')) {
          console.error("This appears to be a network error. Check your internet connection and API server status.");
        }
      }
      
      throw error;
    }
  }

  /**
   * Update a checklist element.
   * @param roadtripId - The ID of the roadtrip.
   * @param checklistElementId - The ID of the checklist element to update.
   * @param checklistElement - The updated checklist element data.
   * @returns Void - The controller returns no content (204).
   */
  public async updateChecklistElement<T>(roadtripId: string | number, checklistElementId: string | number, checklistElement: T): Promise<void> {
    console.log(`Updating checklist element ID: ${checklistElementId} for roadtrip ID: ${roadtripId}`);
    console.log("Original update data:", checklistElement);
    
    // Format the IDs if needed
    const formattedRoadtripId = typeof roadtripId === 'string' ? parseInt(roadtripId, 10) : roadtripId;
    const formattedElementId = typeof checklistElementId === 'string' ? parseInt(checklistElementId, 10) : checklistElementId;
    
    // Create a proper ChecklistElementPostDTO object without the roadtripId and checklistItemId
    // The backend expects: name, isCompleted, assignedUser, priority, category
    const checklistElementData = {
      name: (checklistElement as Record<string, unknown>).name,
      isCompleted: (checklistElement as Record<string, unknown>).isCompleted,
      assignedUser: (checklistElement as Record<string, unknown>).assignedUser,
      priority: (checklistElement as Record<string, unknown>).priority,
      category: (checklistElement as Record<string, unknown>).category
    };
    
    // Map the category if it's "TODO" to "TASK" to match backend enum
    if (checklistElementData.category === "TODO") {
      console.log("Mapping category from TODO to TASK to match backend enum");
      checklistElementData.category = "TASK";
    }
    
    // Based on the controller code, the endpoint is PUT /roadtrips/{roadtripId}/checklist/{checklistelementId}
    const endpoint = `/roadtrips/${formattedRoadtripId}/checklist/${formattedElementId}`;
    console.log(`Update checklist element endpoint: ${endpoint}`);
    console.log(`Full URL: ${this.baseURL}${endpoint}`);
    
    // Log the modified request payload
    console.log("Modified request payload:", JSON.stringify(checklistElementData, null, 2));
    
    try {
      // The controller returns 204 No Content
      await this.put<void>(endpoint, checklistElementData);
      console.log("Checklist element updated successfully");
    } catch (error) {
      console.error("Error in updateChecklistElement:", error);
      
      // Add more detailed error logging
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        
        if ('status' in error) {
          console.error("Error status:", (error as ApplicationError).status);
        }
        
        if ('info' in error) {
          console.error("Error info:", (error as ApplicationError).info);
        }
      }
      
      throw error;
    }
  }

  /**
   * Delete a checklist element.
   * @param roadtripId - The ID of the roadtrip.
   * @param checklistElementId - The ID of the checklist element to delete.
   * @returns Void - The controller returns no content (204).
   */
  public async deleteChecklistElement(roadtripId: string | number, checklistElementId: string | number): Promise<void> {
    console.log(`Deleting checklist element ID: ${checklistElementId} for roadtrip ID: ${roadtripId}`);
    
    // Format the IDs if needed
    const formattedRoadtripId = typeof roadtripId === 'string' ? parseInt(roadtripId, 10) : roadtripId;
    const formattedElementId = typeof checklistElementId === 'string' ? parseInt(checklistElementId, 10) : checklistElementId;
    
    // Based on the controller code, the endpoint is DELETE /roadtrips/{roadtripId}/checklist/{checklistelementId}
    const endpoint = `/roadtrips/${formattedRoadtripId}/checklist/${formattedElementId}`;
    console.log(`Delete checklist element endpoint: ${endpoint}`);
    console.log(`Full URL: ${this.baseURL}${endpoint}`);
    
    try {
      // The controller returns 204 No Content
      await this.delete<void>(endpoint);
      console.log("Checklist element deleted successfully");
    } catch (error) {
      console.error("Error in deleteChecklistElement:", error);
      
      // Add more detailed error logging
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        
        if ('status' in error) {
          console.error("Error status:", (error as ApplicationError).status);
        }
        
        if ('info' in error) {
          console.error("Error info:", (error as ApplicationError).info);
        }
      }
      
      throw error;
    }
  }

  private defaultHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    };
    
    try {
      // Get token using the retrieveToken utility
      const token = retrieveToken("token");
      console.log("Token retrieved from storage:", token ? "Found" : "Not found");
      
      // Only add Authorization header if token exists and is not empty
      if (token && token !== "" && token !== "null" && token !== "undefined") {
        console.log("Using token in Authorization header");
        
        // Use the token as is without adding any prefix
        headers["Authorization"] = token;
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
      // We'll store the raw response text to parse it
      let rawResponse = "";
      
      try {
        // Get the raw response text first
        rawResponse = await res.text();
        console.log("Raw error response:", rawResponse);
        
        // Try to parse as JSON
        let errorInfo;
        try {
          errorInfo = JSON.parse(rawResponse);
          console.log("Parsed error info:", errorInfo);
          
          // Special case for username conflict (409 status with specific detail)
          if (res.status === 409 && 
              errorInfo?.detail && 
              errorInfo.detail.toLowerCase().includes("username already taken")) {
            // Return just the detail message directly
            const error = new Error(errorInfo.detail) as ApplicationError;
            error.info = JSON.stringify(errorInfo, null, 2);
            error.status = res.status;
            throw error;
          }
          
          // For other JSON errors, use the detail or message if available
          if (errorInfo?.detail) {
            const error = new Error(errorInfo.detail) as ApplicationError;
            error.info = JSON.stringify(errorInfo, null, 2);
            error.status = res.status;
            throw error;
          } else if (errorInfo?.message) {
            const error = new Error(errorInfo.message) as ApplicationError;
            error.info = JSON.stringify(errorInfo, null, 2);
            error.status = res.status;
            throw error;
          }
        } catch (parseError) {
          // If it's not valid JSON or doesn't have the expected fields, continue with default handling
          if (parseError instanceof Error && parseError.name !== "SyntaxError") {
            throw parseError; // Re-throw if it's our custom error
          }
          console.error("Error parsing JSON response:", parseError);
        }
      } catch (error) {
        // If we've already created a custom error with the detail message, re-throw it
        if (error instanceof Error && 'status' in error) {
          throw error;
        }
        console.error("Error processing response:", error);
      }
      
      // If we get here, use the default error handling
      const detailedMessage = `${errorMessage} (${res.status}: ${rawResponse || res.statusText})`;
      
      // Create a custom error with additional properties
      const error = new Error(detailedMessage) as ApplicationError;
      error.info = JSON.stringify(
          { status: res.status, statusText: res.statusText },
          null,
          2,
      );
      error.status = res.status;
      
      // Log the error details
      console.error("API Error:", {
        message: error.message,
        status: error.status,
        info: error.info
      });
      
      throw error;
    }
    // Handle empty responses (e.g., 204 No Content)
    if (res.status === 204 || res.headers.get("Content-Length") === "0") {
      console.log("Empty response received, returning undefined");
      return Promise.resolve(undefined as unknown as T);
    }
    
    // Handle JSON responses
    if (res.headers.get("Content-Type")?.includes("application/json")) {
      try {
        const jsonData = await res.json();
        console.log("Parsed JSON response:", jsonData);
        return jsonData as T;
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        return Promise.resolve(undefined as unknown as T);
      }
    }
    
    // Handle other response types
    return Promise.resolve(res as unknown as T);
  }

  /**
   * GET request.
   * @param endpoint - The API endpoint (e.g. "/users").
   * @returns JSON data of type T.
   */
  public async get<T>(endpoint: string): Promise<T> {
    try {
      // Ensure endpoint starts with a slash
      const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      
      const url = `${this.baseURL}${normalizedEndpoint}`;
      console.log(`Making GET request to: ${url}`);
      console.log(`Base URL: ${this.baseURL}`);
      console.log(`Endpoint: ${normalizedEndpoint}`);
      
      const headers = this.defaultHeaders();
      console.log("Request headers:", headers);
      
      // Log the full request details
      console.log("Full request details:", {
        method: "GET",
        url,
        headers
      });
      
      // For GET requests, we don't include a body
      // Only the headers with the Authorization token
      const res = await fetch(url, {
        method: "GET",
        headers: headers,
        // No body for GET requests
      });
      
      console.log(`Response status: ${res.status} ${res.statusText}`);
      console.log("Response headers:", Object.fromEntries([...res.headers.entries()]));
      
      return this.processResponse<T>(
          res,
          "An error occurred while fetching the data.\n",
      );
    } catch (error) {
      console.error(`Error in GET request to ${endpoint}:`, error);
      throw error;
    }
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
    console.log(`Making POST request to: ${url}`);
    
    // Merge default headers with any provided headers
    const headers = {
      ...this.defaultHeaders(),
      ...(options?.headers || {})
    };
    
    console.log("Request headers:", headers);
    console.log("Request payload:", data);
    
    const res = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });
    
    console.log(`Response status: ${res.status} ${res.statusText}`);
    console.log("Response headers:", Object.fromEntries([...res.headers.entries()]));
    
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
    console.log(`Making PUT request to: ${url}`);
    
    const headers = this.defaultHeaders();
    console.log("Request headers:", headers);
    console.log("Request payload:", data);
    
    const res = await fetch(url, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(data),
    });
    
    console.log(`Response status: ${res.status} ${res.statusText}`);
    console.log("Response headers:", Object.fromEntries([...res.headers.entries()]));
    
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
    console.log(`Making DELETE request to: ${url}`);
    
    const headers = this.defaultHeaders();
    console.log("Request headers:", headers);
    
    const res = await fetch(url, {
      method: "DELETE",
      headers: headers,
    });
    
    console.log(`Response status: ${res.status} ${res.statusText}`);
    console.log("Response headers:", Object.fromEntries([...res.headers.entries()]));
    
    return this.processResponse<T>(
        res,
        "An error occurred while deleting the data.\n",
    );
  }

  /**
   * Get all routes for a roadtrip.
   * @param roadtripId - The ID of the roadtrip.
   * @returns The routes.
   */
  public async getRoutes<T>(roadtripId: string | number): Promise<T> {
    console.log(`Getting routes for roadtrip ID: ${roadtripId}`);
    
    // Ensure roadtripId is properly formatted
    const formattedRoadtripId = typeof roadtripId === 'string' ? parseInt(roadtripId, 10) : roadtripId;
    
    const endpoint = `/roadtrips/${formattedRoadtripId}/routes`;
    console.log(`Get routes endpoint: ${endpoint}`);
    
    try {
      const response = await this.get<T>(endpoint);
      console.log("Routes response:", response);
      return response;
    } catch (error) {
      console.error(`Error in getRoutes for roadtrip ID ${formattedRoadtripId}:`, error);
      throw error;
    }
  }

  /**
   * Add a new route to a roadtrip.
   * @param roadtripId - The ID of the roadtrip.
   * @param routeData - The route data to add.
   * @returns The created route.
   */
  public async addRoute<T>(roadtripId: string | number, routeData: RouteCreateRequest): Promise<T> {
    console.log(`Adding route to roadtrip ID: ${roadtripId}`);
    console.log("Original route data:", routeData);
    
    // Ensure roadtripId is properly formatted
    const formattedRoadtripId = typeof roadtripId === 'string' ? parseInt(roadtripId, 10) : roadtripId;
    
    // Extract the enum name directly from the TravelMode enum value
    const getTravelModeEnumName = (travelMode: string): string => {
      // Find the enum key by its value
      for (const enumKey in TravelMode) {
        if (TravelMode[enumKey as keyof typeof TravelMode] === travelMode) {
          return enumKey;
        }
      }
      return travelMode;
    };
    
    // Create a clean payload with just the required fields
    const formattedRouteData = {
      startId: Number(routeData.startId),
      endId: Number(routeData.endId),
      travelMode: getTravelModeEnumName(routeData.travelMode)
    };
    
    console.log("Formatted route data:", formattedRouteData);
    console.log("JSON payload:", JSON.stringify(formattedRouteData, null, 2));
    
    const endpoint = `/roadtrips/${formattedRoadtripId}/routes`;
    console.log(`Add route endpoint: ${endpoint}`);
    console.log(`Full URL: ${this.baseURL}${endpoint}`);
    
    try {
      // Get token
      const token = retrieveToken("token");
      console.log("Token for route creation:", token ? "Found" : "Not found");
      
      if (!token) {
        console.error("No token found for authorization");
        throw new Error("Authentication required. Please log in again.");
      }
      
      // Make the API request with explicit headers
      const headers = {
        "Content-Type": "application/json",
        "Authorization": token
      };
      
      console.log("Request headers:", headers);
      console.log("Request payload:", JSON.stringify(formattedRouteData, null, 2));
      
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(formattedRouteData)
      });
      
      console.log(`Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        let errorDetail = response.statusText;
        try {
          const contentType = response.headers.get("Content-Type") || "";
          console.log("Error response content type:", contentType);
          
          // Log the raw response for debugging
          const rawResponse = await response.text();
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
        }
        
        const detailedMessage = `Error creating route: ${response.status}: ${errorDetail}`;
        console.error(detailedMessage);
        throw new Error(detailedMessage);
      }
      
      // Parse the response
      let responseData;
      if (response.headers.get("Content-Type")?.includes("application/json")) {
        responseData = await response.json();
        console.log("Route created successfully:", responseData);
      } else {
        // If no JSON response, create a default response
        responseData = formattedRouteData;
        console.log("No JSON response, using default:", responseData);
      }
      
      return responseData as T;
    } catch (error) {
      console.error(`Error in addRoute for roadtrip ID ${formattedRoadtripId}:`, error);
      throw error;
    }
  }

  /**
   * Delete all routes for a roadtrip.
   * @param roadtripId - The ID of the roadtrip.
   */
  public async deleteAllRoutes(roadtripId: string | number): Promise<void> {
    console.log(`Deleting all routes for roadtrip ID: ${roadtripId}`);
    
    // Ensure roadtripId is properly formatted
    const formattedRoadtripId = typeof roadtripId === 'string' ? parseInt(roadtripId, 10) : roadtripId;
    
    const endpoint = `/roadtrips/${formattedRoadtripId}/routes`;
    console.log(`Delete all routes endpoint: ${endpoint}`);
    
    try {
      await this.delete<void>(endpoint);
      console.log("All routes deleted successfully");
    } catch (error) {
      console.error(`Error in deleteAllRoutes for roadtrip ID ${formattedRoadtripId}:`, error);
      throw error;
    }
  }

  /**
   * Delete a specific route.
   * @param roadtripId - The ID of the roadtrip.
   * @param routeId - The ID of the route to delete.
   */
  public async deleteRoute(roadtripId: string | number, routeId: number): Promise<void> {
    console.log(`Deleting route with ID ${routeId} for roadtrip ID: ${roadtripId}`);
    
    // Ensure roadtripId is properly formatted
    const formattedRoadtripId = typeof roadtripId === 'string' ? parseInt(roadtripId, 10) : roadtripId;
    
    const endpoint = `/roadtrips/${formattedRoadtripId}/routes/${routeId}`;
    console.log(`Delete route endpoint: ${endpoint}`);
    
    try {
      await this.delete<void>(endpoint);
      console.log("Route deleted successfully");
    } catch (error) {
      console.error(`Error in deleteRoute for roadtrip ID ${formattedRoadtripId}, route ID ${routeId}:`, error);
      throw error;
    }
  }
}
