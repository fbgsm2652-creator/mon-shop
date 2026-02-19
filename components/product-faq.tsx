"use client";

import { Plus, Minus } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
  _key: string;
}

export default function ProductFAQ({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Le 1er est ouvert par défaut pour l'engagement

  if (!items || items.length === 0) return null;

  return (
    <div className="mt-32 border-t border-gray-100 pt-16">
      <h2 className="text-[28px] font-[1000] mb-10 text-[#111111] tracking-tighter italic flex items-center gap-4">
        <span className="bg-blue-600 w-1.5 h-10 rounded-full"></span>
        Questions Fréquentes<span className="text-blue-600">.</span>
      </h2>
      
      <div className="space-y-4 max-w-4xl">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          
          return (
            <div 
              key={item._key} 
              className={`
                rounded-[2rem] overflow-hidden transition-all duration-500 border
                ${isOpen 
                  ? "bg-white border-blue-600 shadow-xl shadow-blue-500/5" 
                  : "bg-[#F5F5F7] border-transparent hover:border-gray-200"
                }
              `}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between p-7 text-left cursor-pointer outline-none"
              >
                <span className={`font-black text-[15px] uppercase tracking-tight transition-colors duration-300 ${isOpen ? "text-blue-600" : "text-[#111111]"}`}>
                  {item.question}
                </span>
                <div className={`p-2.5 rounded-full transition-all duration-500 ${isOpen ? "bg-blue-600 text-white rotate-180" : "bg-white text-gray-400 shadow-sm"}`}>
                  {isOpen ? <Minus size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
                </div>
              </button>
              
              <div 
                className={`transition-all duration-500 ease-in-out ${
                  isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="p-7 pt-0 text-[14px] font-medium text-gray-500 leading-relaxed border-t border-gray-50 mt-2">
                  <div className="pt-6">
                    {item.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}