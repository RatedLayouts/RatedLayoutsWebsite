export const prerender = false;

import type { APIRoute } from "astro";

export const ALL: APIRoute = async ({ request, params }) => {
  const url = new URL(request.url);
  const targetUrl = new URL("v1/" + (params.path || "") + url.search, "https://gdrate.arcticwoof.xyz");
  
  const headers = new Headers(request.headers);
  headers.set("host", targetUrl.host);

  const options: RequestInit = {
    method: request.method,
    headers: headers,
    // @ts-ignore
    duplex: "half",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    options.body = request.body;
  }

  try {
    const response = await fetch(targetUrl, options);
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error: any) {
    console.error("Proxy error for:", targetUrl.toString(), error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch from backend",
        details: error?.message || String(error),
      }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
