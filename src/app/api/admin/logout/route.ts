import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Redirect back to the host the form was posted from (localhost, preview or the live domain).
  const origin = request.nextUrl.origin;
  const response = NextResponse.redirect(new URL("/admin/login", origin), { status: 303 });
  response.cookies.delete("admin_auth");
  return response;
}
