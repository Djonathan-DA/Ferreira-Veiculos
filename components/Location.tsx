import { store } from "@/lib/config";
import {
  ClockIcon,
  InstagramIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
} from "./Icons";

export function Location() {
  return (
    <section id="contato" className="bg-night-800/50 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] font-bold tracking-[0.35em] text-gold-500 uppercase">
            Contato & Localização
          </span>
          <h2 className="font-display mt-3 text-3xl font-bold text-white sm:text-4xl">
            Venha nos <span className="text-gold-metal">visitar</span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-5">
          {/* Informações de contato */}
          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-night-700 p-7 lg:col-span-2">
            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/12 text-gold-400">
                <PinIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Endereço</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/65">
                  {store.address}
                </p>
                <a
                  href={store.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-block text-xs font-semibold text-gold-400 hover:underline"
                >
                  Traçar rota no Google Maps →
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/12 text-gold-400">
                <PhoneIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Telefone</h3>
                <a
                  href={`tel:${store.phoneTel}`}
                  className="mt-1 block text-sm text-white/65 hover:text-gold-300"
                >
                  {store.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/12 text-gold-400">
                <ClockIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Horário</h3>
                <p className="mt-1 text-sm text-white/65">{store.hours}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/12 text-gold-400">
                <InstagramIcon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Instagram</h3>
                <a
                  href={store.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-sm text-white/65 hover:text-gold-300"
                >
                  {store.instagramHandle}
                </a>
              </div>
            </div>

            <a
              href={store.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#2ee06f] to-[#1faa52] px-5 py-3.5 text-sm font-bold text-night transition-transform hover:scale-[1.02]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chamar no WhatsApp agora
            </a>
          </div>

          {/* Mapa */}
          <div className="overflow-hidden rounded-2xl border border-white/10 lg:col-span-3">
            <iframe
              src={store.mapsEmbed}
              title="Mapa — Ferreira Veículos em Águas Lindas de Goiás"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="h-[380px] w-full border-0 lg:h-full lg:min-h-[460px]"
              style={{ filter: "grayscale(0.85) contrast(1.05) brightness(0.92)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
