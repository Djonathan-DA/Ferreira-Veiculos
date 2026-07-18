/**
 * ============================================================
 *  ESTOQUE DA LOJA — edite este arquivo para atualizar o site
 * ============================================================
 *
 * ⚠️  Os veículos abaixo são um ESTOQUE DE DEMONSTRAÇÃO.
 *     Substitua pelos carros reais da loja (modelo, ano, km e preço).
 *
 * Para adicionar a FOTO de um carro:
 *   1. Coloque a imagem na pasta  public/cars/  (ex.: public/cars/civic.jpg)
 *   2. Preencha o campo  image: "/cars/civic.jpg"
 *   Enquanto não houver foto, o site mostra uma arte elegante da marca.
 *
 * Campos:
 *   brand        Marca (usada no filtro do catálogo)
 *   model        Modelo e versão
 *   year         Ano fabricação/modelo
 *   price        Preço em reais (número, sem pontos)
 *   km           Quilometragem (número)
 *   fuel         "Flex" | "Gasolina" | "Diesel" | "Híbrido" | "Elétrico"
 *   transmission "Automático" | "Manual" | "CVT"
 *   color        Cor do veículo
 *   body         "sedan" | "hatch" | "suv" | "picape"  (define a silhueta da arte)
 *   featured     true = aparece na vitrine de destaques
 *   badges       Selos opcionais (ex.: "Único dono", "Revisado")
 *   image        Caminho da foto (opcional)
 */

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: string;
  price: number;
  km: number;
  fuel: string;
  transmission: string;
  color: string;
  body: "sedan" | "hatch" | "suv" | "picape";
  featured?: boolean;
  badges?: string[];
  image?: string;
};

export const vehicles: Vehicle[] = [
  {
    id: "civic-exl-2020",
    brand: "Honda",
    model: "Civic EXL 2.0 CVT",
    year: "2020/2020",
    price: 124900,
    km: 68000,
    fuel: "Flex",
    transmission: "CVT",
    color: "Cinza",
    body: "sedan",
    featured: true,
    badges: ["Único dono", "Revisado"],
  },
  {
    id: "corolla-xei-2021",
    brand: "Toyota",
    model: "Corolla XEi 2.0",
    year: "2021/2021",
    price: 129900,
    km: 55000,
    fuel: "Flex",
    transmission: "Automático",
    color: "Prata",
    body: "sedan",
    featured: true,
    badges: ["Revisado"],
  },
  {
    id: "compass-longitude-2022",
    brand: "Jeep",
    model: "Compass Longitude T270",
    year: "2022/2022",
    price: 139900,
    km: 48000,
    fuel: "Flex",
    transmission: "Automático",
    color: "Branco",
    body: "suv",
    featured: true,
    badges: ["Garantia de procedência"],
  },
  {
    id: "tcross-highline-2021",
    brand: "Volkswagen",
    model: "T-Cross Highline 1.4 TSI",
    year: "2021/2021",
    price: 116900,
    km: 52000,
    fuel: "Flex",
    transmission: "Automático",
    color: "Cinza",
    body: "suv",
  },
  {
    id: "onix-premier-2022",
    brand: "Chevrolet",
    model: "Onix Plus Premier 1.0 Turbo",
    year: "2022/2022",
    price: 84900,
    km: 38000,
    fuel: "Flex",
    transmission: "Automático",
    color: "Preto",
    body: "sedan",
  },
  {
    id: "creta-prestige-2021",
    brand: "Hyundai",
    model: "Creta Prestige 2.0",
    year: "2021/2021",
    price: 109900,
    km: 60000,
    fuel: "Flex",
    transmission: "Automático",
    color: "Branco",
    body: "suv",
  },
  {
    id: "toro-volcano-2021",
    brand: "Fiat",
    model: "Toro Volcano 2.0 Diesel 4x4",
    year: "2021/2021",
    price: 129900,
    km: 74000,
    fuel: "Diesel",
    transmission: "Automático",
    color: "Cinza",
    body: "picape",
  },
  {
    id: "hilux-srv-2020",
    brand: "Toyota",
    model: "Hilux SRV 2.8 Diesel 4x4",
    year: "2020/2020",
    price: 189900,
    km: 98000,
    fuel: "Diesel",
    transmission: "Automático",
    color: "Prata",
    body: "picape",
    badges: ["Revisado"],
  },
  {
    id: "polo-tsi-2020",
    brand: "Volkswagen",
    model: "Polo TSI Comfortline",
    year: "2020/2020",
    price: 79900,
    km: 45000,
    fuel: "Flex",
    transmission: "Automático",
    color: "Branco",
    body: "hatch",
  },
  {
    id: "duster-iconic-2022",
    brand: "Renault",
    model: "Duster Iconic 1.6 CVT",
    year: "2022/2022",
    price: 92900,
    km: 41000,
    fuel: "Flex",
    transmission: "CVT",
    color: "Laranja",
    body: "suv",
  },
  {
    id: "hb20-vision-2022",
    brand: "Hyundai",
    model: "HB20 Vision 1.0",
    year: "2022/2022",
    price: 69900,
    km: 33000,
    fuel: "Flex",
    transmission: "Manual",
    color: "Prata",
    body: "hatch",
  },
  {
    id: "strada-volcano-2022",
    brand: "Fiat",
    model: "Strada Volcano 1.3",
    year: "2022/2022",
    price: 94900,
    km: 36000,
    fuel: "Flex",
    transmission: "Manual",
    color: "Vermelho",
    body: "picape",
  },
];
