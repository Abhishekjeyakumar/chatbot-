import { supabase } from "../lib/supabase";

// SIGN UP
export async function signUp(
  name,
  email,
  password
) {
  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
    });

  if (error) {
    throw error;
  }

  // INSERT USER PROFILE
  await supabase.from("profiles").insert([
    {
      id: data.user.id,
      name,
      email,
    },
  ]);

  return data;
}

// LOGIN
export async function login(
  email,
  password
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    throw error;
  }

  return data;
}

// LOGOUT
export async function logout() {
  await supabase.auth.signOut();
}