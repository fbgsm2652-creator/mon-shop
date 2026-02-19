import Link from "next/link";
import AddressForm from "@/components/AddressForm";
import { client } from "@/sanity/lib/client";
import { auth } from "@clerk/nextjs/server";

export default async function AdressesPage() {
  const { userId } = await auth();
  
  // On récupère les adresses existantes
  const customer = await client.fetch(
    `*[_type == "customer" && clerkId == $userId][0]`, 
    { userId }
  );

  return (
    <main className="bg-[#F5F5F7] min-h-screen pt-10 pb-24 text-black">
      <div className="max-w-3xl mx-auto px-4">
        
        <header className="mb-12">
          <Link href="/mon-compte" className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-4 inline-block">
            ← Retour au compte
          </Link>
          <h1 className="text-[40px] font-[1000] tracking-tighter text-[#111111]">
            Mes Adresses<span className="text-blue-600">.</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {/* Section Formulaire */}
          <section>
            <h2 className="text-[14px] font-black uppercase tracking-widest text-gray-400 mb-6">Ajouter une nouvelle adresse</h2>
            <AddressForm />
          </section>

          {/* Section Liste */}
          <section>
            <h2 className="text-[14px] font-black uppercase tracking-widest text-gray-400 mb-6">Adresses enregistrées</h2>
            {customer?.addresses?.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {customer.addresses.map((addr: any, index: number) => (
                  <div key={index} className="bg-white p-6 rounded-[2rem] flex justify-between items-center shadow-sm">
                    <div>
                      <p className="font-bold text-[16px]">{addr.street}</p>
                      <p className="text-gray-400 text-sm">{addr.zipCode} {addr.city}</p>
                    </div>
                    {addr.isDefault && (
                      <span className="bg-blue-50 text-blue-600 text-[9px] font-black uppercase px-3 py-1 rounded-full">Défaut</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic">Aucune adresse enregistrée pour le moment.</p>
            )}
          </section>
        </div>

      </div>
    </main>
  );
}