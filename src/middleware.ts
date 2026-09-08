import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Refresh / resolve the auth session on every request.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // 1) Login page: always pass straight through, except that signed-in users
  //    are sent to the dashboard (never back to login → no loop possible).
  if (pathname === "/admin/login" || pathname === "/admin/login/") {
    if (user) {
      return NextResponse.redirect(new URL("/admin/events", request.url));
    }
    return response;
  }

  // 2) Protected area: any other /admin route requires a session.
  if (pathname.startsWith("/admin") && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run on everything except Next.js internals, favicons and static files
     * (SVG/PNG/JPG/JPEG/GIF/WEBP/ICO). API/image routes are left untouched.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
