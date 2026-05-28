"use client";

// Layout admin : sidebar + header + zone de contenu
// La vérification d'auth côté serveur est assurée par middleware.ts
// La page /admin/login est exclue du layout (pas de sidebar)
import React from "react";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { username, logout } = useAdminAuth();

  // La page de login a son propre design sans sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-svh" style={{ background: "var(--space-bg)" }}>
      <AdminSidebar onLogout={logout} username={username} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title="Administration" username={username} onLogout={logout} />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
