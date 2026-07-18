import { store } from "@/lib/config";
import { Logo } from "./Logo";
import { InstagramIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "./Icons";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-night-800">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div className="flex flex-col items-start gap-4">
          <Logo variant="inline" prefix="ft" />
          <p className="max-w-xs text-sm leading-relaxed text-white/55">
            {store.tagline}. Compra, venda e troca de veículos com atendimento
            diferenciado.
          </p>
          <div className="flex gap-3">
            <a
              href={store.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Ferreira Veículos"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-gold-500 hover:text-gold-400"
            >
              <InstagramIcon className="h-4.5 w-4.5" />
            </a>
            <a
              href={store.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp da Ferreira Veículos"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-[#25D366] hover:text-[#25D366]"
            >
              <WhatsAppIcon className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>

        <nav className="flex flex-col gap-2.5" aria-label="Links do site">
          <h3 className="mb-1 text-xs font-bold tracking-[0.25em] text-gold-500 uppercase">
            Navegação
          </h3>
          {[
            ["#inicio", "Início"],
            ["#estoque", "Estoque"],
            ["#a-loja", "A Loja"],
            ["#avaliacoes", "Avaliações"],
            ["#contato", "Contato"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="w-fit text-sm text-white/60 transition-colors hover:text-gold-300"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-3.5">
          <h3 className="mb-1 text-xs font-bold tracking-[0.25em] text-gold-500 uppercase">
            Contato
          </h3>
          <p className="flex items-start gap-2.5 text-sm text-white/60">
            <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
            {store.address}
          </p>
          <a
            href={`tel:${store.phoneTel}`}
            className="flex items-center gap-2.5 text-sm text-white/60 hover:text-gold-300"
          >
            <PhoneIcon className="h-4 w-4 shrink-0 text-gold-500" />
            {store.phoneDisplay}
          </a>
          <a
            href={store.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-sm text-white/60 hover:text-gold-300"
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0 text-gold-500" />
            Atendimento via WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-white/8 py-5">
        <p className="px-4 text-center text-xs text-white/40">
          © {new Date().getFullYear()} {store.name} — Águas Lindas de Goiás.
          Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
