"use client";

// Sidebar de navigation admin
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  icon: string;
  label: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", icon: "📊", label: "Dashboard" },
  { href: "/leaderboard", icon: "🏆", label: "Classement live" },
  { href: "/admin#sessions", icon: "🎮", label: "Sessions" },
  { href: "/admin#settings", icon: "⚙️", label: "Paramètres" },
];

interface AdminSidebarProps {
  onLogout: () => void;
  username: string | null;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ onLogout, username }) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Sidebar desktop */}
      <aside
        className="hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300"
        style={{
          width: collapsed ? "64px" : "220px",
          background: "var(--space-surface)",
          borderRight: "1px solid var(--space-border)",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16" style={{ borderBottom: "1px solid var(--space-border)" }}>
          <span className="text-xl flex-shrink-0">🚀</span>
          {!collapsed && (
            <span className="font-bold text-sm truncate" style={{ color: "var(--space-gold)" }}>
              To The Moon
            </span>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="ml-auto text-xs opacity-40 hover:opacity-80 transition-opacity"
            style={{ color: "var(--space-muted)" }}
            title={collapsed ? "Étendre" : "Réduire"}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {NAV_ITEMS.map(item => {
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  color: isActive ? "var(--space-accent)" : "var(--space-muted)",
                  background: isActive ? "rgba(76,201,240,0.1)" : "transparent",
                  border: isActive ? "1px solid rgba(76,201,240,0.2)" : "1px solid transparent",
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = "var(--space-text)";
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLAnchorElement).style.color = "var(--space-muted)";
                }}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Profil + déconnexion */}
        <div className="px-2 py-4 space-y-2" style={{ borderTop: "1px solid var(--space-border)" }}>
          {!collapsed && (
            <div className="px-3 py-2">
              <p className="text-xs font-medium truncate" style={{ color: "var(--space-text)" }}>
                👤 {username ?? "Admin"}
              </p>
              <p className="text-xs" style={{ color: "var(--space-muted)" }}>Administrateur</p>
            </div>
          )}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
            style={{ color: "var(--space-red)" }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(239,35,60,0.1)")}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
          >
            <span className="flex-shrink-0">🚪</span>
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
