import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/mon-compte(.*)',
  '/dashboard-preparation(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // 1. On récupère l'objet auth
  const authObj = await auth();

  // 2. Si c'est une route protégée ET que l'utilisateur n'est pas connecté
  if (isProtectedRoute(req) && !authObj.userId) {
    return authObj.redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // On ignore les fichiers internes de Next.js et les fichiers statiques
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // On force le middleware à s'exécuter sur les routes API
    '/(api|trpc)(.*)',
  ],
};