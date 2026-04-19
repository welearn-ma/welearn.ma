import type {
  RegistrationPayload,
  RegistrationResponse,
} from "@/types/registration";

export async function submitRegistration(
  payload: RegistrationPayload,
): Promise<RegistrationResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  let response: Response;

  try {
    response = await fetch(`${baseUrl}/api/registrations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Impossible de joindre l'API d'inscription (reseau/CORS).",
    );
  }

  if (!response.ok) {
    let errorMessage = "La demande d'inscription a echoue.";

    try {
      const errorPayload =
        (await response.json()) as Partial<RegistrationResponse>;
      if (errorPayload.message) {
        errorMessage = errorPayload.message;
      }
    } catch {
      // Ignore malformed response bodies and keep default message.
    }

    throw new Error(errorMessage);
  }

  return (await response.json()) as RegistrationResponse;
}
