import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/mon-compte(.*)',
  '/dashboard-preparation(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const authObj = await auth();
    if (!authObj.userId) {
      return authObj.redirectToSignIn();
    }
  }
});

export const config = {
  matcher: [
    // On ignore absolument tout ce qui touche à l'interne de Next.js
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};