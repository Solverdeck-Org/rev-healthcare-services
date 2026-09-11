import { NextResponse } from "next/server";
import { register, STATE_COOKIE } from "@/lib/wix-auth";
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
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const nickname = String(form.get("screenName") ?? "").trim();

  if (!email || !password) {
    return NextResponse.redirect(
      backToLogin(request, "Enter an email address and password to sign up."),
      303,
    );
  }

  try {
    const result = await register(
      email,
      password,
      nickname ? { nickname } : undefined,
    );

    // Wix emailed a code; park the state token and collect it on /verify.
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

    if (!result.sessionToken) {
      return NextResponse.redirect(
        backToLogin(request, "We could not create your account."),
        303,
      );
    }

    return completeLogin(request, result.sessionToken);
  } catch {
    return NextResponse.redirect(
      backToLogin(request, "We could not create your account."),
      303,
    );
  }
}
