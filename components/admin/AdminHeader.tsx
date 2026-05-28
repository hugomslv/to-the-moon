"use client";

// Header admin avec titre de page et bouton de déconnexion mobile
import React from "react";

interface AdminHeaderProps {
  title: string;
  username: string | null;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, username, onLogout }) => {
  return (
    <header
      className="h-16 flex items-center px-6 gap-4 sticky top-0 z-30"
      style={{
        background: "rgba(13,27,42,0.9)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--space-border)",
      }}
    >
      {/* Titre de la page */}
      <h1 className="flex-1 font-bold text-lg truncate" style={{ color: "var(--space-text)" }}>
        {title}
      </h1>

      {/* Indicateur de statut */}
      <div
        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
        style={{
          background: "rgba(6,214,160,0.1)",
          border: "1px solid rgba(6,214,160,0.25)",
          color: "var(--space-green)",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        En ligne
      </div>

      {/* Nom de l'admin */}
      <div className="hidden sm:flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
          style={{ background: "var(--space-accent)", color: "#050a18" }}
        >
          {(username ?? "A")[0].toUpperCase()}
        </div>
        <span className="text-sm font-medium" style={{ color: "var(--space-text)" }}>
          {username ?? "Admin"}
        </span>
      </div>

      {/* Bouton déconnexion (visible sur mobile aussi) */}
      <button
        onClick={onLogout}
        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer"
        style={{
          background: "rgba(239,35,60,0.1)",
          border: "1px solid rgba(239,35,60,0.3)",
          color: "var(--space-red)",
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(239,35,60,0.2)")}
        onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(239,35,60,0.1)")}
      >
        🚪 Déco
      </button>
    </header>
  );
};

export default AdminHeader;
