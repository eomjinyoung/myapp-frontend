export async function refreshAccessToken(): Promise<string | null> {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
    });

    if (!response.ok) {
      return null;
    }

    const { accessToken } = await response.json();
    return accessToken;
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return null;
  }
}
