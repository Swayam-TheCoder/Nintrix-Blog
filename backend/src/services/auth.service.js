import { supabaseAuth, supabaseAdmin } from "../config/supabase.js";

export const signupUser = async ({ email, password, name }) => {
  const { data, error } = await supabaseAuth.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const loginUser = async ({ email, password }) => {
  const { data, error } =
    await supabaseAuth.auth.signInWithPassword({
      email,
      password
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const refreshUserSession = async (refreshToken) => {
  const { data, error } =
    await supabaseAuth.auth.refreshSession({
      refresh_token: refreshToken
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const logoutUser = async (accessToken) => {
  const { error } =
    await supabaseAdmin.auth.admin.signOut(
      accessToken,
      "local"
    );

  if (error) {
    throw new Error(error.message);
  }
};

export const getUserFromToken = async (accessToken) => {
  const { data, error } =
    await supabaseAuth.auth.getUser(accessToken);

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
};

export const sendPasswordResetEmail = async (email) => {
  const { data, error } =
    await supabaseAuth.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.PASSWORD_RESET_REDIRECT_URL
    });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const updateUserPassword = async (accessToken, password) => {
  const { data, error } =
    await supabaseAuth.auth.updateUser(
      {
        password
      },
      {
        accessToken
      }
    );

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getGoogleOAuthUrl = async () => {
  const { data, error } =
    await supabaseAuth.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.GOOGLE_OAUTH_REDIRECT_URL
      }
    });

  if (error) {
    throw new Error(error.message);
  }

  return data.url;
};