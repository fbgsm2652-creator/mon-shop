// styles/clerk-theme.ts

export const renwClerkTheme = {
  // On reste sur le look blanc épuré de RENW (pas de base dark)
  variables: {
    colorPrimary: "#2563eb", // Ton bleu signature
    colorTextBase: "#111111",
    colorBackground: "#ffffff",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    borderRadius: "2rem",
  },
  elements: {
    card: "shadow-none border border-gray-100 p-8 rounded-[2.5rem]",
    headerTitle: "text-[28px] font-[1000] tracking-tighter uppercase",
    headerSubtitle: "text-gray-400 font-medium text-[14px]",
    socialButtonsBlockButton: "rounded-2xl border-gray-100 hover:bg-gray-50 transition-all text-[12px] font-bold",
    formButtonPrimary: "bg-[#111111] hover:bg-blue-600 rounded-full py-6 uppercase text-[11px] font-[1000] tracking-[0.2em] transition-all shadow-none mt-4",
    formFieldInput: "bg-[#F5F5F7] border-none rounded-2xl py-4 px-6 outline-none focus:ring-2 focus:ring-blue-600 text-[14px]",
    formFieldLabel: "text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2",
    footerActionLink: "text-blue-600 font-bold hover:text-black transition-colors",
    dividerLine: "bg-gray-100",
    dividerText: "text-gray-300 uppercase text-[9px] font-black tracking-widest",
    identityPreviewEditButtonIcon: "text-blue-600",
  }
};