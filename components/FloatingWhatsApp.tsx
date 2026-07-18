import { store } from "@/lib/config";
import { WhatsAppIcon } from "./Icons";

export function FloatingWhatsApp() {
  return (
    <a
      href={store.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a Ferreira Veículos no WhatsApp"
      className="fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-transform hover:scale-110"
    >
      <span
        className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-25"
        aria-hidden="true"
      />
      <WhatsAppIcon className="relative h-7 w-7" />
    </a>
  );
}
