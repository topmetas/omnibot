import crypto from "crypto";

/**
 * Gera API Key segura para clientes SaaS
 */
export function generateApiKey() {
  return crypto.randomBytes(32).toString("hex");
}