import { API_BASE_URL } from "./api";
import type { Suggestion } from "../types/Suggestion";

export async function sendSuggestion(suggestion: Suggestion) {
  const response = await fetch(`${API_BASE_URL}/api/suggestions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(suggestion),
  });

  if (!response.ok) {
    throw new Error("Error al enviar sugerencia");
  }

  return response.json();
}