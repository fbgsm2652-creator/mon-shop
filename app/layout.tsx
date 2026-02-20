export const dynamic = "force-dynamic";

import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs"; 
import { frFR } from "@clerk/localizations"; 
import { client } from "@/sanity/lib/client"; 
import Script from "next/script"; 
import { headers } from "next/headers";

// --- 1. RÉCUPÉRATION DES DONNÉES (HIÉRARCHIE DYNAMIQUE) ---
async function getNavigationData() {
  const query = `{
    "categories": *[_type == "category" && !defined(parent)] | order(title asc) {
      _id, 
      title, 
      menuImage,
      "slug": slug.current,
      "subCategories": *[_type == "category" && references(^._id)] | order(title asc) {
        _id, 
        title,
        "finalModels": *[_type == "category" && references(^._id) && isFinal == true] | order(title asc) {
          _id, 
          title, 
          "slug": slug.current
        }
      }
    },
    "headerSettings": *[_type == "headerSettings"][0],
    "home": *[_type == "homeSettings"][0]{headerScripts, metaTitle, metaDescription}
  }`;
  
  return await client.fetch(query, {}, { next: { revalidate: 60 } });
}

// --- 2. SEO DYNAMIQUE ---
export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(`*[_type == "settings"][0]`);
  const home = await client.fetch(`*[_type == "homeSettings"][0]`);
  
  const companyName = settings?.companyName || "RENW";
  const siteUrl = settings?.baseUrl || "https://renw.fr";
  
  const title = home?.metaTitle || `${companyName} | Expertise Tech & Pièces Certifiées`;
  const description = home?.metaDescription || "Spécialiste de la pièce détachée et de l'iPhone reconditionné.";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${companyName}`
    },
    description: description,
    keywords: ["iPhone", "reconditionné", "pièces détachées", "RENW"],
    robots: "index, follow",
    manifest: "/manifest.json", 
    openGraph: {
      title: title,
      description: description,
      url: siteUrl,
      siteName: companyName,
      locale: "fr_FR",
      type: "website",
      images: [{ url: "/default-og.png" }],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, 
};

// --- 3. STRUCTURE PRINCIPALE ---
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get("x-invoke-path") || "";
  const isStudio = pathname.startsWith("/studio");

  const { categories, headerSettings, home } = await getNavigationData();

  return (
    <ClerkProvider localization={frFR}> 
      <html lang="fr" className="scroll-smooth">
        <body className="min-h-screen antialiased selection:bg-blue-600/10 selection:text-blue-600 bg-white text-[#111111]" style={{ fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
          <Toaster position="top-center" />
          
          {home?.headerScripts && (
            <Script
              id="header-scripts"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: home.headerScripts }}
            />
          )}

          {!isStudio && (
            <Header 
              categories={categories || []} 
              settings={headerSettings || {}} 
            />
          )}
          
          <main className={!isStudio ? "pt-[140px] md:pt-[180px]" : ""}>
            {children}
          </main>
          
          {!isStudio && <Footer />}
        </body>
      </html>
    </ClerkProvider>
  );
}