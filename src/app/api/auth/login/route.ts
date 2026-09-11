import { NextResponse } from "next/server";
import { login } from "@/lib/wix-auth";
import {
  backToLogin,
  completeLogin,
  isConfigured,
  NOT_CONFIGURED,
} from "../shared";

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.redirect(backToLogin(request, NOT_CONFIGURED), 303);
  }

  const form = await request.formData();
  const email = String(form.get("identifier") ?? "").trim();
  const password = String(form.get("password") ?? "");

  if (!email || !password) {
    return NextResponse.redirect(
      backToLogin(request, "Enter your email address and password."),
      303,
    );
  }

  try {
    const result = await login(email, password);
    if (result.state !== "SUCCESS" || !result.sessionToken) {
      return NextResponse.redirect(
        backToLogin(request, "We could not sign you in. Check your details."),
        303,
      );
    }

    return completeLogin(request, result.sessionToken);
  } catch {
    return NextResponse.redirect(
      backToLogin(request, "That email address or password is incorrect."),
      303,
    );
  }
}
