import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Configuration pour l'affichage des images et du texte riche de Sanity
const components = {
  types: {
    image: ({ value }: any) => (
      <div className="relative w-full aspect-video my-10 overflow-hidden rounded-[2rem] shadow-lg">
        <img
          src={urlFor(value).url()}
          alt={value.alt || "Image article"}
          className="object-cover w-full h-full"
        />
      </div>
    ),
  },
  block: {
    h2: ({ children }: any) => <h2 className="text-[32px] font-bold tracking-tighter mt-12 mb-6 text-[#111111]">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-[24px] font-bold tracking-tight mt-8 mb-4 text-[#111111]">{children}</h3>,
    normal: ({ children }: any) => <p className="text-[18px] leading-[1.8] text-gray-700 mb-6">{children}</p>,
  },
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Requête GROQ pour récupérer l'article, sa catégorie et les produits liés
  const post = await client.fetch(`
    *[_type == "post" && slug.current == $slug][0]{
      title,
      publishedAt,
      mainImage,
      content,
      excerpt,
      "category": blogCategory->{title, "slug": slug.current},
      "relatedProducts": relatedProducts[]->{
        _id,
        name,
        "slug": slug.current,
        images,
        "basePrice": grades[0].capacities[0].price
      }
    }
  `, { slug });

  if (!post) notFound();

  return (
    <main className="bg-white min-h-screen pt-32 pb-24">
      <article className="max-w-4xl mx-auto px-4 md:px-6">
        
        {/* FIL D'ARIANE / CATEGORIE */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/blog" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors">Le Mag</Link>
          <span className="text-gray-300 text-[10px]">/</span>
          {post.category && (
            <Link href={`/blog/${post.category.slug}`} className="text-[10px] font-black uppercase tracking-widest text-blue-600">
              {post.category.title}
            </Link>
          )}
        </div>

        {/* TITRE ET RESUMÉ */}
        <header className="mb-12">
          <h1 className="text-[40px] md:text-[60px] font-[1000] tracking-tighter leading-[0.9] mb-8 text-[#111111]">
            {post.title}<span className="text-blue-600">.</span>
          </h1>
          <p className="text-[20px] text-gray-500 italic leading-relaxed border-l-4 border-blue-600 pl-6">
            {post.excerpt}
          </p>
        </header>

        {/* IMAGE PRINCIPALE */}
        {post.mainImage && (
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[3rem] mb-16 shadow-2xl">
            <img
              src={urlFor(post.mainImage).url()}
              alt={post.title}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        {/* CONTENU DE L'ARTICLE */}
        <div className="max-w-3xl mx-auto">
          <PortableText value={post.content} components={components} />
        </div>

        {/* SECTION PRODUITS ASSOCIÉS (LE BOOST BOUTIQUE) */}
        {post.relatedProducts && post.relatedProducts.length > 0 && (
          <section className="mt-24 pt-16 border-t border-gray-100">
            <h2 className="text-[24px] font-black uppercase tracking-tighter mb-10 text-center">Équipement conseillé</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {post.relatedProducts.map((product: any) => (
                <Link key={product._id} href={`/${product.slug}`} className="flex items-center gap-6 p-6 bg-[#FAFAFA] rounded-[2rem] hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100 group">
                  <div className="w-24 h-24 bg-white rounded-[1.5rem] overflow-hidden p-2">
                    {product.images && (
                      <img src={urlFor(product.images[0]).url()} alt={product.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] text-[#111111]">{product.name}</h3>
                    <p className="text-blue-600 font-black text-[14px] mt-1">Dès {product.basePrice}€</p>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2 block italic">Voir le produit →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}