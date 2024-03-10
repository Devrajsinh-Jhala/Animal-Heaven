import { authMiddleware } from "@clerk/nextjs";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export default authMiddleware({
    publicRoutes: ["/", "/blog", "/about", "/pricing"],
    ignoredRoutes: ["/api/webhook/stripe"]
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/courses", "/(api|trpc)(.*)"]

};