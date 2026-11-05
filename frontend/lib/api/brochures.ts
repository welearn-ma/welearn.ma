import type {
  BrochureRequestPayload,
  BrochureRequestResponse,
} from "@/types/brochure";

export async function requestBrochure(
  payload: BrochureRequestPayload,
): Promise<BrochureRequestResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/api/brochures/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Impossible de joindre l'API de brochure (reseau/CORS).",
    );
  }

  if (!response.ok) {
    let errorMessage = "La demande de brochure a echoue.";

    try {
      const errorPayload = (await response.json()) as { message?: string };
      if (errorPayload.message) {
        errorMessage = errorPayload.message;
      }
    } catch {
      // Ignore malformed response bodies and keep default message.
    }

    throw new Error(errorMessage);
  }

  return (await response.json()) as BrochureRequestResponse;
}
