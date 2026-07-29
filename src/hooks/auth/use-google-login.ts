import { useMutation, useQueryClient } from "@tanstack/react-query";

import { env } from "@/config/env";
import { queryKeys } from "@/constants/query-keys";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth-store";
import type { ApiError } from "@/types/api";
import type { OAuthLoginResponseData } from "@/types/auth";

/**
 * IMPORTANT: the backend's `App\Services\Auth\Providers\GoogleProvider`
 * validates the incoming token by calling
 * `https://www.googleapis.com/oauth2/v3/userinfo` with it as a Bearer
 * token. That endpoint expects an OAuth **access token**, not the ID
 * token (JWT) that Google's default "Sign in with Google" button/
 * `google.accounts.id` credential flow returns. So this hook deliberately
 * uses the GIS **OAuth2 token client** (`google.accounts.oauth2`) instead
 * — it's a different API within the same Google Identity Services script,
 * requesting an access token via the standard OAuth consent popup.
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: {
              access_token?: string;
              error?: string;
            }) => void;
          }) => { requestAccessToken: () => void };
        };
      };
    };
  }
}

const GIS_SCRIPT_SRC = "https://accounts.google.com/gsi/client";
let gisScriptPromise: Promise<void> | null = null;

function loadGoogleIdentityServices(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Google sign-in is only available in the browser."),
    );
  }

  if (window.google?.accounts?.oauth2) return Promise.resolve();

  if (!gisScriptPromise) {
    gisScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${GIS_SCRIPT_SRC}"]`,
      );
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () =>
          reject(new Error("Failed to load Google Sign-In.")),
        );
        return;
      }

      const script = document.createElement("script");
      script.src = GIS_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to load Google Sign-In."));
      document.head.appendChild(script);
    });
  }

  return gisScriptPromise;
}

async function requestGoogleAccessToken(): Promise<string> {
  await loadGoogleIdentityServices();

  if (!env.googleClientId) {
    throw new Error(
      "Google sign-in is not configured (missing VITE_GOOGLE_CLIENT_ID).",
    );
  }

  return new Promise<string>((resolve, reject) => {
    const client = window.google!.accounts.oauth2.initTokenClient({
      client_id: env.googleClientId,
      scope: "openid email profile",
      callback: (response) => {
        if (response.error || !response.access_token) {
          reject(
            new Error(
              response.error || "Google sign-in was cancelled or failed.",
            ),
          );
          return;
        }
        resolve(response.access_token);
      },
    });

    client.requestAccessToken();
  });
}

export function useGoogleLogin() {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation<OAuthLoginResponseData, ApiError | Error, void>({
    mutationFn: async () => {
      const accessToken = await requestGoogleAccessToken();
      return authService.oauthLogin({ provider: "google", token: accessToken });
    },
    onSuccess: (data) => {
      setSession({ user: data.user, tokens: data.tokens });
      queryClient.setQueryData(queryKeys.auth.me(), data.user);
    },
  });
}
