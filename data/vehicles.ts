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
  image?: string;
  status?: VehicleStatus;
  /** preenchidos quando o carro é vendido */
  soldPrice?: number;
  soldDate?: string;
};

const all = (data as { vehicles: Vehicle[] }).vehicles;

/** Veículos exibidos no site público (não vendidos). */
export const vehicles: Vehicle[] = all.filter(
  (v) => (v.status ?? "disponivel") !== "vendido",
);
