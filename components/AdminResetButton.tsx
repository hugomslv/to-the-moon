"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminResetButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    if (!confirm("Supprimer toutes les sessions ? Cette action est irréversible.")) return;
    setLoading(true);
    await fetch("/api/admin/reset", { method: "POST" });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      onClick={handleReset}
      disabled={loading}
      className="w-full py-3 rounded-xl font-bold transition-opacity disabled:opacity-50"
      style={{ background: "var(--space-red)", color: "white" }}
    >
      {loading ? "Suppression…" : "Réinitialiser toutes les sessions"}
    </button>
  );
}
