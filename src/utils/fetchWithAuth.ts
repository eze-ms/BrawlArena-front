export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("token");

  if (!token) {
    return Promise.reject(new Error("Token no encontrado"));
  }

  const headers = new Headers(init.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const url = `${import.meta.env.VITE_API_URL}${input}`;
  const response = await fetch(url, { ...init, headers });

  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return Promise.reject(new Error("Token expirado o inválido"));
  }

  return response;
}
