// Utilitaires d'authentification admin
// Utilise l'API Web Crypto (compatible Edge Runtime et Node.js 18+)
// Aucune dépendance externe — tout est natif au runtime

const SECRET = process.env.ADMIN_TOKEN_SECRET ?? "fallback-dev-secret";
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 heures
export const ADMIN_COOKIE = "ttm_admin_token";

// ── Helpers Web Crypto ────────────────────────────────────────────────────

const encoder = new TextEncoder();

async function getHmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bufferToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(str: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(str));
  return bufferToHex(hash);
}

// ── API publique ──────────────────────────────────────────────────────────

/** Hache un mot de passe en SHA-256 pour comparaison avec ADMIN_PASSWORD_HASH */
export async function hashPassword(password: string): Promise<string> {
  return sha256Hex(password);
}

/** Valide les identifiants admin contre les variables d'environnement */
export async function validateCredentials(username: string, password: string): Promise<boolean> {
  const expectedUser = process.env.ADMIN_USERNAME ?? "admin";
  const expectedHash = process.env.ADMIN_PASSWORD_HASH ?? "";
  const givenHash = await hashPassword(password);
  return username === expectedUser && givenHash === expectedHash;
}

/** Génère un token signé HMAC-SHA256 avec expiration */
export async function generateToken(username: string): Promise<string> {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `${username}:${exp}`;
  const encoded = btoa(unescape(encodeURIComponent(payload)));

  const key = await getHmacKey();
  const sigBuf = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const sig = bufferToHex(sigBuf);

  return `${encoded}.${sig}`;
}

/** Vérifie la signature et l'expiration d'un token */
export async function verifyToken(token: string): Promise<{ valid: boolean; username?: string }> {
  try {
    const dotIdx = token.indexOf(".");
    if (dotIdx === -1) return { valid: false };

    const encoded = token.slice(0, dotIdx);
    const sig = token.slice(dotIdx + 1);

    // Décode le payload
    const payload = decodeURIComponent(escape(atob(encoded)));
    const [username, expStr] = payload.split(":");
    if (!username || !expStr) return { valid: false };
    if (Date.now() > parseInt(expStr, 10)) return { valid: false };

    // Vérifie la signature HMAC
    const key = await getHmacKey();
    const expectedBuf = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    const expectedSig = bufferToHex(expectedBuf);

    // Comparaison constante-time manuelle (évite le timing attack)
    if (sig.length !== expectedSig.length) return { valid: false };
    let diff = 0;
    for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expectedSig.charCodeAt(i);
    if (diff !== 0) return { valid: false };

    return { valid: true, username };
  } catch {
    return { valid: false };
  }
}
