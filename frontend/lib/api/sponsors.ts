import type { SponsorPayload, SponsorResponse } from "@/types/sponsor";

export async function submitSponsor(
  payload: SponsorPayload,
): Promise<SponsorResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/api/sponsors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Impossible de joindre l'API de sponsoring (reseau/CORS).");
  }

  if (!response.ok) {
    let errorMessage = "La demande de sponsoring a echoue.";

    try {
      const errorPayload = (await response.json()) as Partial<SponsorResponse>;
      if (errorPayload.message) {
        errorMessage = errorPayload.message;
      }
    } catch {
      // Ignore malformed response bodies and keep default message.
    }

    throw new Error(errorMessage);
  }

  return (await response.json()) as SponsorResponse;
}
