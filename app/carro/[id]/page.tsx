import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVehicle, photosOf, vehicles } from "@/data/vehicles";
import { whatsappLinkFor } from "@/components/VehicleCard";
import { VehicleGallery } from "@/components/VehicleGallery";
import { VehicleCard } from "@/components/VehicleCard";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import {
  CalendarIcon,
  FuelIcon,
  GaugeIcon,
  GearboxIcon,
  WhatsAppIcon,
} from "@/components/Icons";

export function generateStaticParams() {
  return vehicles.map((v) => ({ id: v.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const v = getVehicle(id);
  if (!v) return { title: "Veículo não encontrado | Ferreira Veículos" };
  return {
    title: `${v.brand} ${v.model} ${v.year ?? ""} | Ferreira Veículos`,
    description:
      v.description ??
      `${v.brand} ${v.model}${v.year ? ` ${v.year}` : ""} à venda na Ferreira Veículos, Águas Lindas de Goiás.`,
  };
}

function formatPrice(value?: number) {
  if (value == null) return "Consulte o valor";
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

function formatKm(value: number) {
  return `${value.toLocaleString("pt-BR")} km`;
}

export default async function VehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = getVehicle(id);
  if (!vehicle) notFound();

  const images = photosOf(vehicle);
  const specs = [
    vehicle.year && { icon: CalendarIcon, label: "Ano", value: vehicle.year },
    vehicle.km != null && {
      icon: GaugeIcon,
      label: "Quilometragem",
      value: formatKm(vehicle.km),
    },
    vehicle.transmission && {
      icon: GearboxIcon,
      label: "Câmbio",
      value: vehicle.transmission,
    },
    vehicle.fuel && { icon: FuelIcon, label: "Combustível", value: vehicle.fuel },
  ].filter(Boolean) as {
    icon: typeof CalendarIcon;
    label: string;
    value: string;
  }[];

  const extraDetails = [
    vehicle.version && ["Versão / motor", vehicle.version],
    vehicle.color && ["Cor", vehicle.color],
    vehicle.doors && ["Portas", String(vehicle.doors)],
    vehicle.steering && ["Direção", vehicle.steering],
    vehicle.acceptsTrade != null && [
      "Aceita troca",
      vehicle.acceptsTrade ? "Sim" : "Não",
    ],
  ].filter(Boolean) as [string, string][];

  const related = vehicles
    .filter((v) => v.id !== vehicle.id && v.brand === vehicle.brand)
    .slice(0, 3);
  const fillers = vehicles
    .filter((v) => v.id !== vehicle.id && !related.includes(v))
    .slice(0, Math.max(0, 3 - related.length));
  const suggestions = [...related, ...fillers];

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 sm:pt-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Link
            href="/#estoque"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white/50 transition-colors hover:text-gold-400"
          >
            ← Voltar ao estoque
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            {/* Galeria */}
            <div>
              <VehicleGallery vehicle={vehicle} images={images} />

              {vehicle.description && (
                <div className="mt-8">
                  <h2 className="text-lg font-bold text-white">
                    Sobre este veículo
                  </h2>
                  <p className="mt-3 leading-relaxed whitespace-pre-line text-white/70">
                    {vehicle.description}
                  </p>
                </div>
              )}

              {extraDetails.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-bold text-white">
                    Mais informações
                  </h2>
                  <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                    {extraDetails.map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-xs text-white/40 uppercase tracking-wide">
                          {label}
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold text-white/85">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>

            {/* Coluna de informações + CTA */}
            <aside>
              <div className="rounded-2xl border border-white/10 bg-night-700 p-5 sm:p-6">
                <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-white/70 uppercase">
                  {vehicle.brand}
                </span>
                <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  {vehicle.model}
                </h1>
                {vehicle.color && (
                  <p className="mt-1 text-sm text-white/50">
                    Cor {vehicle.color}
                  </p>
                )}

                {(vehicle.badges?.length || vehicle.status === "negociacao") && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
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

                <p className="font-display mt-5 text-3xl font-bold text-gold-400">
                  {formatPrice(vehicle.price)}
                </p>

                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-white/10 pt-5 text-sm text-white/75">
                  {specs.map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <s.icon className="h-4 w-4 shrink-0 text-gold-500" />
                      <dd>{s.value}</dd>
                    </div>
                  ))}
                </dl>

                <a
                  href={whatsappLinkFor(vehicle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-[#2ee06f] to-[#1faa52] px-4 py-3.5 text-sm font-bold text-night transition-transform hover:scale-[1.02]"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Falar com a loja no WhatsApp
                </a>
                <p className="mt-3 text-center text-xs text-white/40">
                  Negociação direta, sem intermediários.
                </p>
              </div>
            </aside>
          </div>

          {/* Sugestões */}
          {suggestions.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold text-white">
                {related.length > 0
                  ? `Outros ${vehicle.brand} disponíveis`
                  : "Você também pode gostar"}
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {suggestions.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
