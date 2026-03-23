import type {
  RegistrationPayload,
  RegistrationResponse,
} from "@/types/registration";

export async function submitRegistration(
  payload: RegistrationPayload,
): Promise<RegistrationResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const response = await fetch(`${baseUrl}/api/registrations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Registration request failed");
  }

  return (await response.json()) as RegistrationResponse;
}
