import { jwtVerify } from "jose";
import { supabaseJWKS } from "../config/jwt.js";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is required"
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format"
      });
    }

    const token = authHeader.substring(7);

    const { payload } = await jwtVerify(token, supabaseJWKS, {
      issuer: `${process.env.SUPABASE_URL}/auth/v1`,
      audience: "authenticated"
    });

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };

    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token"
    });
  }
};