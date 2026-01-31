import { NextRequest, NextResponse } from "next/server";
import { getUserFromReqProxy, TEACHERS } from "./helpers/helpers";

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/teacher")) {
    const user = getUserFromReqProxy(req);

    if (!user) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    try {
      if (
        (pathname.startsWith("/admin") && user.email !== "admin@admin") ||
        (pathname.startsWith("/teacher") && !TEACHERS.includes(user.email))
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}
