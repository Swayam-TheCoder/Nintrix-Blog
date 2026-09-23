import {
  signupUser,
  loginUser,
  logoutUser,
  getUserFromToken,
  refreshUserSession,
  sendPasswordResetEmail,
  updateUserPassword
} from "../services/auth.service.js";

import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "../validators/auth.validator.js";

export const signup = async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);

    const result = await signupUser(data);

    return res.status(201).json({
      success: true,
      message:
        "Account created successfully. Please verify your email.",
      user: result.user,
      session: result.session
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);

    const result = await loginUser(data);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: result.user,
      session: result.session
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required"
      });
    }

    const result = await refreshUserSession(refresh_token);

    return res.status(200).json({
      success: true,
      message: "Session refreshed successfully",
      user: result.user,
      session: result.session
    });
  } catch (error) {
    console.error("Refresh session error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token"
    });
  }
};

export const logout = async (req, res) => {
  try {
    await logoutUser(req.accessToken);

    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const me = async (req, res) => {
  try {
    const user = await getUserFromToken(req.accessToken);

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session"
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);

    await sendPasswordResetEmail(email);

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, a password reset link has been sent."
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password } = resetPasswordSchema.parse(req.body);

    const user = await updateUserPassword(
      req.accessToken,
      password
    );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      user
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};