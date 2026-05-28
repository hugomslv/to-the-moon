"use client";

// Page de connexion admin – design spatial cohérent avec la landing page
// useSearchParams est isolé dans LoginForm + Suspense (requis par Next.js 15)
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import SpotlightCard from "@/components/ui/SpotlightCard";
import DecryptedText from "@/components/ui/DecryptedText";

// Contenu du formulaire (isolé pour Suspense + useSearchParams)
function LoginForm() {
  const { login, authenticated, loading } = useAdminAuth();
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Redirige si déjà connecté
  useEffect(() => {
    if (!loading && authenticated) router.replace(from);
  }, [authenticated, loading, router, from]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!username.trim()) { setError("Le nom d'utilisateur est requis."); return; }
    if (!password) { setError("Le mot de passe est requis."); return; }

    setSubmitting(true);
    const result = await login(username.trim(), password);
    if (!result.ok) {
      setError(result.error ?? "Identifiants incorrects.");
      setSubmitting(false);
    } else {
      router.push(from);
    }
  }

  if (loading) {
    return (
      <div className="min-h-svh flex items-center justify-center" style={{ background: "var(--space-bg)" }}>
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main
      className="min-h-svh flex items-center justify-center px-6 py-12 relative"
      style={{ background: "var(--space-bg)" }}
    >
      {/* Fond statique minimaliste */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(76,201,240,0.06) 0%, transparent 60%)," +
            "radial-gradient(ellipse 60% 40% at 80% 80%, rgba(124,58,237,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* En-tête */}
        <div className="text-center mb-10 space-y-3">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest mb-4"
            style={{
              background: "rgba(76,201,240,0.08)",
              border: "1px solid rgba(76,201,240,0.25)",
              color: "var(--space-accent)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            <DecryptedText text="Accès restreint" animateOn="view" speed={30} />
          </div>
          <div className="text-3xl">🔐</div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--space-text)" }}>
            Administration
          </h1>
          <p className="text-sm" style={{ color: "var(--space-muted)" }}>
            To The Moon – ICT-306
          </p>
        </div>

        {/* Formulaire avec SpotlightCard */}
        <SpotlightCard className="rounded-2xl" spotlightColor="rgba(76,201,240,0.1)">
          <div
            className="rounded-2xl p-7 space-y-5"
            style={{
              background: "var(--space-surface)",
              border: "1px solid var(--space-border)",
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom d'utilisateur */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--space-muted)" }}>
                  Nom d&apos;utilisateur
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--space-border)",
                    color: "var(--space-text)",
                  }}
                  onFocus={e => (e.target.style.borderColor = "var(--space-accent)")}
                  onBlur={e => (e.target.style.borderColor = "var(--space-border)")}
                />
              </div>

              {/* Mot de passe */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium" style={{ color: "var(--space-muted)" }}>
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid var(--space-border)",
                    color: "var(--space-text)",
                  }}
                  onFocus={e => (e.target.style.borderColor = "var(--space-accent)")}
                  onBlur={e => (e.target.style.borderColor = "var(--space-border)")}
                />
              </div>

              {/* Se souvenir de moi */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center transition-all duration-200"
                    style={{
                      background: remember ? "var(--space-accent)" : "rgba(255,255,255,0.05)",
                      border: `1px solid ${remember ? "var(--space-accent)" : "var(--space-border)"}`,
                    }}
                  >
                    {remember && <span className="text-[10px] text-black font-bold">✓</span>}
                  </div>
                </div>
                <span className="text-xs" style={{ color: "var(--space-muted)" }}>
                  Se souvenir de moi
                </span>
              </label>

              {/* Message d'erreur */}
              {error && (
                <p
                  className="text-xs px-3 py-2 rounded-lg"
                  style={{ color: "var(--space-red)", background: "rgba(239,35,60,0.1)" }}
                >
                  ⚠ {error}
                </p>
              )}

              {/* Bouton de connexion */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, var(--space-accent), #7c3aed)",
                  color: "#fff",
                  boxShadow: submitting ? "none" : "0 0 20px rgba(76,201,240,0.25)",
                }}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Connexion…
                  </span>
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>

            <div className="pt-2 text-center">
              <Link href="/" className="text-xs transition-colors" style={{ color: "var(--space-muted)" }}>
                ← Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </SpotlightCard>

        <p className="text-center text-xs mt-4" style={{ color: "rgba(148,163,184,0.4)" }}>
          Identifiants : ADMIN_USERNAME / ADMIN_PASSWORD_HASH dans .env
        </p>
      </div>
    </main>
  );
}

// Fallback pendant le chargement de useSearchParams
function LoginFallback() {
  return (
    <div className="min-h-svh flex items-center justify-center" style={{ background: "var(--space-bg)" }}>
      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );
}

// Exporte le wrapper avec Suspense (obligatoire pour useSearchParams en Next.js 15)
export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
