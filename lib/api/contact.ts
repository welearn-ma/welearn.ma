import type { ContactPayload, ContactResponse } from "@/types/contact";

export async function submitContact(
  payload: ContactPayload,
): Promise<ContactResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const response = await fetch(`${baseUrl}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Impossible d'envoyer votre message.";

    try {
      const errorPayload = (await response.json()) as Partial<ContactResponse>;
      if (errorPayload.message) {
        errorMessage = errorPayload.message;
      }
    } catch {
      // Keep default message when backend payload is not JSON.
    }

    throw new Error(errorMessage);
  }

  return (await response.json()) as ContactResponse;
}
