/**
 * ============================================================
 *  ESTOQUE DA LOJA — edite este arquivo para atualizar o site
 * ============================================================
 *
 * Estoque montado a partir dos anúncios do Instagram
 * @ferreira_veiculos_go (fotos em public/cars/).
 *
 * Campos OPCIONAIS podem ficar de fora — o site mostra "Consulte"
 * no preço e omite a linha quando a informação não existe.
 *
 * Para adicionar a FOTO de um carro:
 *   1. Coloque a imagem na pasta  public/cars/  (ex.: public/cars/civic.jpg)
 *   2. Preencha o campo  image: "/cars/civic.jpg"
 *   Enquanto não houver foto, o site mostra uma arte elegante da marca.
 *
 * Campos:
 *   brand        Marca (usada no filtro do catálogo)
 *   model        Modelo e versão
 *   year         (opcional) Ano fabricação/modelo
 *   price        (opcional) Preço em reais (número, sem pontos)
 *   km           (opcional) Quilometragem (número)
 *   fuel         (opcional) "Flex" | "Gasolina" | "Diesel" | "Híbrido" | "Elétrico"
 *   transmission (opcional) "Automático" | "Manual" | "CVT"
 *   color        (opcional) Cor do veículo
 *   body         "sedan" | "hatch" | "suv" | "picape"  (define a silhueta da arte)
 *   featured     true = aparece na vitrine de destaques
 *   badges       Selos opcionais (ex.: "Único dono", "Revisado")
 *   image        Caminho da foto (opcional)
 */

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year?: string;
  price?: number;
  km?: number;
  fuel?: string;
  transmission?: string;
  color?: string;
  body: "sedan" | "hatch" | "suv" | "picape";
  featured?: boolean;
  badges?: string[];
  image?: string;
};

export const vehicles: Vehicle[] = [
  {
    id: "onix-joy-2019",
    brand: "Chevrolet",
    model: "Onix Joy 1.0",
    year: "2019",
    fuel: "Flex",
    transmission: "Manual",
    color: "Branco",
    body: "hatch",
    featured: true,
    badges: ["Recém-chegado"],
    image: "/cars/onix-joy.jpg",
  },
  {
    id: "i30-2010",
    brand: "Hyundai",
    model: "i30 2.0 143cv",
    year: "2010",
    fuel: "Gasolina",
    color: "Prata",
    body: "hatch",
    featured: true,
    badges: ["Raridade"],
    image: "/cars/i30.jpg",
  },
  {
    id: "edge-v6-2009",
    brand: "Ford",
    model: "Edge V6 3.5",
    year: "2009",
    fuel: "Gasolina",
    transmission: "Automático",
    color: "Preto",
    body: "suv",
    featured: true,
    badges: ["SUV premium"],
    image: "/cars/edge.jpg",
  },
  {
    id: "argo",
    brand: "Fiat",
    model: "Argo",
    fuel: "Flex",
    color: "Cinza",
    body: "hatch",
    image: "/cars/argo.jpg",
  },
  {
    id: "hb20",
    brand: "Hyundai",
    model: "HB20",
    fuel: "Flex",
    color: "Prata",
    body: "hatch",
    image: "/cars/hb20.jpg",
  },
  {
    id: "versa",
    brand: "Nissan",
    model: "Versa",
    fuel: "Flex",
    color: "Prata",
    body: "sedan",
    image: "/cars/versa.jpg",
  },
  {
    id: "siena",
    brand: "Fiat",
    model: "Siena",
    fuel: "Flex",
    color: "Preto",
    body: "sedan",
    image: "/cars/siena.jpg",
  },
  {
    id: "palio-fire",
    brand: "Fiat",
    model: "Palio Fire",
    fuel: "Flex",
    transmission: "Manual",
    color: "Branco",
    body: "hatch",
    image: "/cars/palio-fire.jpg",
  },
  {
    id: "celta",
    brand: "Chevrolet",
    model: "Celta",
    fuel: "Flex",
    transmission: "Manual",
    color: "Vermelho",
    body: "hatch",
    image: "/cars/celta.jpg",
  },
];
