"use client";

// Hook d'authentification admin
// TODO : remplacer les appels fetch par un SDK/service dédié si connexion à un backend externe
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthState {
  loading: boolean;
  authenticated: boolean;
  username: string | null;
}

export function useAdminAuth() {
  const [state, setState] = useState<AuthState>({
    loading: true,
    authenticated: false,
    username: null,
  });
  const router = useRouter();

  // Vérifie la validité du cookie de session au montage
  useEffect(() => {
    fetch("/api/admin/verify")
      .then(res => res.json())
      .then(data => {
        setState({
          loading: false,
          authenticated: data.valid === true,
          username: data.username ?? null,
        });
      })
      .catch(() => setState({ loading: false, authenticated: false, username: null }));
  }, []);

  const login = useCallback(
    async (username: string, password: string): Promise<{ ok: boolean; error?: string }> => {
      // TODO : remplacer par un appel à ton backend (Spring Boot ou autre)
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; username?: string };

      if (!res.ok) return { ok: false, error: data.error ?? "Erreur serveur" };

      setState({ loading: false, authenticated: true, username: data.username ?? username });
      return { ok: true };
    },
    []
  );

  const logout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setState({ loading: false, authenticated: false, username: null });
    router.push("/admin/login");
  }, [router]);

  return { ...state, login, logout };
}
