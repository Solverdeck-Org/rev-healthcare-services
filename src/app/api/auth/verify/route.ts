import { NextResponse } from "next/server";
import { STATE_COOKIE, verifyCode } from "@/lib/wix-auth";
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
  const code = String(form.get("code") ?? "").trim();

  const stateToken = request.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith(`${STATE_COOKIE}=`))
    ?.slice(STATE_COOKIE.length + 1);

  if (!stateToken) {
    return NextResponse.redirect(
      backToLogin(
        request,
        "Your verification link expired. Please sign up again.",
      ),
      303,
    );
  }

  const retry = (message: string) => {
    const url = new URL("/verify", request.url);
    url.searchParams.set("error", message);
    return NextResponse.redirect(url, 303);
  };

  if (!code) return retry("Enter the code from your email.");

  try {
    const result = await verifyCode(code, decodeURIComponent(stateToken));

    if (result.state !== "SUCCESS" || !result.sessionToken) {
      return retry("That code was not accepted. Check it and try again.");
    }

    const response = await completeLogin(request, result.sessionToken);
    response.cookies.delete(STATE_COOKIE);
    return response;
  } catch {
    return retry("That code was not accepted. Check it and try again.");
  }
}
