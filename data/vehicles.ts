/**
 * ============================================================
 *  ESTOQUE DA LOJA
 * ============================================================
 *
 * Os dados vivem em  data/vehicles.json  e são administrados
 * pelo PAINEL ADMINISTRATIVO em  /admin  (protegido por senha).
 *
 * Cada alteração feita no painel vira um commit neste repositório
 * e o site é republicado automaticamente (~1 minuto).
 *
 * Você também pode editar o vehicles.json diretamente no GitHub.
 *
 * Status possíveis:
 *   "disponivel"  → aparece no site normalmente
 *   "negociacao"  → aparece no site com o selo "Em negociação"
 *   "vendido"     → sai do site e entra nas estatísticas de venda
 */

import data from "./vehicles.json";

export type VehicleStatus = "disponivel" | "negociacao" | "vendido";

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year?: string;
  price?: number;
  /** custo de aquisição — usado só no painel administrativo */
  cost?: number;
  km?: number;
  fuel?: string;
  transmission?: string;
  color?: string;
  body: "sedan" | "hatch" | "suv" | "picape";
  featured?: boolean;
  badges?: string[];
  /** capa (legado) — quando houver `images`, a primeira foto vira a capa */
  image?: string;
  /** galeria completa de fotos, na ordem de exibição */
  images?: string[];
  /** descrição livre exibida na página de detalhes do veículo */
  description?: string;
  /** motorização / versão, ex.: "1.0 Turbo Flex" */
  version?: string;
  doors?: number;
  steering?: string;
  acceptsTrade?: boolean;
  status?: VehicleStatus;
  /** preenchidos quando o carro é vendido */
  soldPrice?: number;
  soldDate?: string;
};

/** Fotos do veículo (galeria com fallback para o campo legado `image`). */
export function photosOf(v: Vehicle): string[] {
  if (v.images && v.images.length > 0) return v.images;
  return v.image ? [v.image] : [];
}

/** Foto de capa usada nos cards. */
export function coverOf(v: Vehicle): string | undefined {
  return photosOf(v)[0];
}

const all = (data as { vehicles: Vehicle[] }).vehicles;

/** Todos os veículos cadastrados, incluindo vendidos (uso interno/admin). */
export const allVehicles: Vehicle[] = all;

/** Veículos exibidos no site público (não vendidos). */
export const vehicles: Vehicle[] = all.filter(
  (v) => (v.status ?? "disponivel") !== "vendido",
);

/** Busca um veículo público pelo id — usado na página de detalhes. */
export function getVehicle(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}
