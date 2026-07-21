import Link from "next/link";
import { coverOf, type Vehicle } from "@/data/vehicles";
import { store } from "@/lib/config";
import { CarArt } from "./CarArt";
import {
  CalendarIcon,
  FuelIcon,
  GaugeIcon,
  GearboxIcon,
  WhatsAppIcon,
} from "./Icons";

function formatPrice(value?: number) {
  if (value == null) return "Consulte";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function formatKm(value: number) {
  return `${value.toLocaleString("pt-BR")} km`;
}

export function whatsappLinkFor(vehicle: Vehicle) {
  const msg = `Olá! Tenho interesse no ${vehicle.brand} ${vehicle.model}${
    vehicle.year ? ` ${vehicle.year}` : ""
  } que vi no site da Ferreira Veículos.`;
  return `${store.whatsapp}?text=${encodeURIComponent(msg)}`;
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const cover = coverOf(vehicle);
  return (
    <article className="card-lift group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-night-700">
      <Link href={`/carro/${vehicle.id}`} className="contents">
        {/* Foto / arte do veículo */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <CarArt vehicle={vehicle} />
          )}

          {/* selos */}
          {(vehicle.status === "negociacao" ||
            (vehicle.badges && vehicle.badges.length > 0)) && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {vehicle.status === "negociacao" && (
                <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-bold tracking-wide text-night uppercase">
                  Em negociação
                </span>
              )}
              {(vehicle.badges ?? []).map((b) => (
                <span
                  key={b}
                  className="rounded-full bg-gold-500 px-2.5 py-1 text-[10px] font-bold tracking-wide text-night uppercase"
                >
                  {b}
                </span>
              ))}
            </div>
          )}

          <span className="absolute right-3 bottom-3 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-white/85 uppercase backdrop-blur-sm">
            {vehicle.brand}
          </span>
        </div>

        {/* Informações */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="text-base font-bold text-white transition-colors group-hover:text-gold-300 sm:text-lg">
            {vehicle.model}
          </h3>
          {vehicle.color && (
            <p className="mt-0.5 text-xs text-white/50">Cor {vehicle.color}</p>
          )}

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[13px] text-white/70">
            {vehicle.year && (
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 shrink-0 text-gold-500" />
                <dd>{vehicle.year}</dd>
              </div>
            )}
            {vehicle.km != null && (
              <div className="flex items-center gap-2">
                <GaugeIcon className="h-4 w-4 shrink-0 text-gold-500" />
                <dd>{formatKm(vehicle.km)}</dd>
              </div>
            )}
            {vehicle.transmission && (
              <div className="flex items-center gap-2">
                <GearboxIcon className="h-4 w-4 shrink-0 text-gold-500" />
                <dd>{vehicle.transmission}</dd>
              </div>
            )}
            {vehicle.fuel && (
              <div className="flex items-center gap-2">
                <FuelIcon className="h-4 w-4 shrink-0 text-gold-500" />
                <dd>{vehicle.fuel}</dd>
              </div>
            )}
          </dl>

          <div className="mt-5 flex items-end justify-between border-t border-white/10 pt-4">
            <div>
              <p className="text-[10px] tracking-widest text-white/45 uppercase">
                Preço
              </p>
              <p className="font-display text-xl font-bold text-gold-400 sm:text-[22px]">
                {formatPrice(vehicle.price)}
              </p>
            </div>
            <span className="text-xs font-semibold text-white/40 transition-colors group-hover:text-gold-300">
              Ver detalhes →
            </span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        <a
          href={whatsappLinkFor(vehicle)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#2ee06f] to-[#1faa52] px-4 py-3 text-sm font-bold text-night transition-transform hover:scale-[1.02]"
        >
          <WhatsAppIcon className="h-4.5 w-4.5" />
          Tenho interesse
        </a>
      </div>
    </article>
  );
}
