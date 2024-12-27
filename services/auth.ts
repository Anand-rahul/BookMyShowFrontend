import { setAuthToken } from "./api";

export async function signInWithGoogle(): Promise<{
  success: boolean;
  token?: string;
  user?: any;
  error?: string;
}> {
  try {
    const response = await fetch("/api/auth/google", { method: "GET" });
    const data = await response.json();

    if (data.success) {
      setAuthToken(data.token);
      return { success: true, token: data.token, user: data.user };
    } else {
      return {
        success: false,
        error: data.error || "Failed to sign in with Google",
      };
    }
  } catch (error) {
    console.error("Error signing in with Google:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
