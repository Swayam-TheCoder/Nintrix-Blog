import {
  signupUser,
  loginUser,
  logoutUser,
  getUserFromToken
} from "../services/auth.service.js";

import {
  signupSchema,
  loginSchema
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