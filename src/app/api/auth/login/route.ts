import { NextResponse } from "next/server";
import { login, STATE_COOKIE } from "@/lib/wix-auth";
import {
  backToLogin,
  completeLogin,
  isConfigured,
  NOT_CONFIGURED,
  SECURE_COOKIE,
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

    // An existing member whose email was never confirmed: Wix emails a code
    // and expects us to finish on /verify, exactly as it does for signup.
    if (result.state === "REQUIRE_EMAIL_VERIFICATION" && result.stateToken) {
      const response = NextResponse.redirect(
        new URL("/verify", request.url),
        303,
      );
      response.cookies.set(STATE_COOKIE, result.stateToken, {
        ...SECURE_COOKIE,
        maxAge: 900,
      });
      return response;
    }

    if (result.state === "REQUIRE_OWNER_APPROVAL") {
      const url = new URL("/login", request.url);
      url.searchParams.set("notice", "Your membership is awaiting approval.");
      return NextResponse.redirect(url, 303);
    }

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
