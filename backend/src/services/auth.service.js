import { supabaseAuth } from "../config/supabase.js";

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

export const logoutUser = async (accessToken) => {
  const { error } = await supabaseAuth.auth.admin.signOut(
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