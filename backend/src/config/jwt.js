import { createRemoteJWKSet } from "jose";

const jwksUrl = process.env.SUPABASE_JWKS_URL;

if (!jwksUrl) {
  throw new Error("SUPABASE_JWKS_URL is missing");
}

export const supabaseJWKS = createRemoteJWKSet(
  new URL(jwksUrl)
);