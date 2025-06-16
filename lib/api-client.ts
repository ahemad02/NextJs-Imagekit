import { IVideo } from "@/models/Video";

export type Video = Omit<IVideo, "_id">;
type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class APIClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api/${endpoint}`, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: defaultHeaders,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getVideos() {
    return this.fetch("/video");
  }

  async createVideo(video: Video) {
    return this.fetch("/video", {
      method: "POST",
      body: video,
    });
  }
}

export const apiClient = new APIClient();
