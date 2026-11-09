import { supabase } from "@/lib/supabase";

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const signupUser = async ({
  name,
  email,
  password,
}: SignupData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

export const loginUser = async ({
  email,
  password,
}: LoginData) => {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    throw error;
  }

  return data;
};


export const loginWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Google login error:", error);
    throw error;
  }

  return data;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  const { data, error } =
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

  if (error) {
    throw error;
  }

  return data;
};

export const updatePassword = async (
  password: string
) => {
  const { data, error } =
    await supabase.auth.updateUser({
      password,
    });

  if (error) {
    throw error;
  }

  return data;
};