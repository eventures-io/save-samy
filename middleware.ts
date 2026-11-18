import { NextResponse } from "next/server";

// Campaign ended. Every public route returns HTTP 410 Gone with no body so
// search engines deindex and visitors get a browser-native error page.
// /studio is left alone so the owner can still reach the Sanity CMS.
// To revive the site: `git revert` the commit that introduced this file.
export function middleware() {
  return new NextResponse(null, {
    status: 410,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export const config = {
  matcher: [
    "/((?!studio|_next|api|favicon\\.ico|apple-icon\\.png|icon\\.png|robots\\.txt|sitemap\\.xml).*)",
  ],
};
