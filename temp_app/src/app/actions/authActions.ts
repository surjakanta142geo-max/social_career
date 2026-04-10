"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const requestedRole = formData.get("role") as string;
  const role = requestedRole === "recruiter" ? "recruiter" : "job_seeker";
  const account_type = (formData.get("account_type") as string) || null;
  const company_name = (formData.get("company_name") as string) || null;
  const org_name = (formData.get("org_name") as string) || null;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
        account_type,
        company_name,
        org_name,
      },
    },
  });

  if (error) {
    console.error("--- Signup Error Detail ---");
    console.error("Message:", error.message);
    console.error("Status:", (error as any).status);
    console.error("---------------------------");
    return { error: error.message };
  }

  return { success: true, role };
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("--- Login Error Detail ---");
    console.error("Message:", error.message);
    console.error("---------------------------");
    return { error: error.message };
  }

  // Fetch user role for redirection
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  return { success: true, role: profile?.role };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function getUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  return profile;
}
