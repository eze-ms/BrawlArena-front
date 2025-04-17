export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token no encontrado");
  }

  const headers = {
    ...(init.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const url = `${import.meta.env.VITE_API_URL}${input}`;
  const response = await fetch(url, { ...init, headers });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[fetchWithAuth] Error response body:", errorText);
    throw new Error(errorText || "Error en la petición");
  }

  return response;
}
