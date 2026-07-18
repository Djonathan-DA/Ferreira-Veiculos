# 📘 Documentação Completa — Site Ferreira Veículos

> Documento único que descreve **todo o projeto**, do briefing inicial ao estado
> atual. Serve como referência para o dono da loja e para qualquer desenvolvedor
> que for continuar o trabalho.

---

## 1. Visão geral

Site institucional + catálogo de veículos da **Ferreira Veículos**, loja de
seminovos em **Águas Lindas de Goiás – GO**. O objetivo é apresentar o estoque
de forma elegante e dinâmica e converter visitantes em conversas no **WhatsApp**
da loja.

- **Nome:** Ferreira Veículos
- **Cidade:** Águas Lindas de Goiás – GO
- **Nota Google:** 4,5 (36 avaliações)
- **WhatsApp oficial:** https://wa.me/message/S4Y6SXEYINUAM1
- **Instagram:** [@ferreira_veiculos_go](https://www.instagram.com/ferreira_veiculos_go)
- **Telefone:** (61) 99140-4475
- **Endereço:** Quadra 01, Lote 01 – Mansões Centroeste, Águas Lindas de Goiás – GO, 72915-180

---

## 2. Briefing original (o que foi pedido)

O cliente solicitou um site **100% pronto e funcional** com:

1. Objetivo de **venda de veículos**.
2. Nome da loja: **Ferreira Veículos**.
3. Design **elegante, moderno, dark**, seguindo a identidade visual da marca
   (prata cromado + dourado sobre fundo preto).
4. **Hero** com o **vídeo anexado** (um Civic em cena cinematográfica) ao fundo,
   em **baixa opacidade**, sem atrapalhar a leitura das informações.
5. **Catálogo** fácil de visualizar e **dinâmico**.
6. Em cada carro, o botão de compra deve **direcionar para o WhatsApp** da loja.
7. Incluir os **dados do Google** (endereço, nota, avaliações, serviços).
8. Incluir o **Instagram** da loja.
9. Banco de dados no **Supabase** se necessário e **deploy na Vercel**.

---

## 3. O que foi entregue (estado atual)

### ✅ Concluído e testado
- Projeto **Next.js 15 + Tailwind CSS 4** (App Router, TypeScript).
- **Design dark** com paleta preto/dourado/cromado fiel à logo.
- **Logo recriada em SVG** (vetorial): silhueta do carro em ouro/prata,
  "FERREIRA" cromado e "VEÍCULOS" dourado, com a linha de brilho.
- **Hero com o vídeo** do Civic ao fundo em opacidade ~40%, com camadas de
  escurecimento para leitura + **fallback cinematográfico em CSS** (caso o vídeo
  não carregue). O vídeo foi **comprimido de 17 MB → 1,5 MB** (720p, sem áudio,
  `faststart`) para carregar rápido.
- **Catálogo dinâmico**: busca por texto, filtro por marca (chips) e ordenação
  (destaques, menor/maior preço, menor km, mais novo). Cards com ano, km, câmbio,
  combustível, cor, selos ("Único dono", "Revisado" etc.) e preço em destaque.
- **Todos os botões de compra** ("Tenho interesse", "Falar no WhatsApp", botão
  flutuante) apontam para `https://wa.me/message/S4Y6SXEYINUAM1`.
- **Seção "Por que comprar"** (procedência, financiamento, troca, negociação).
- **Avaliações do Google**: nota 4,5, 36 avaliações e 2 depoimentos reais.
- **Contato & Localização**: endereço, telefone, horário, Instagram, botão de
  WhatsApp e **mapa do Google** incorporado.
- **Rodapé** completo + **botão flutuante de WhatsApp** com animação.
- **SEO**: metadados, Open Graph, favicon SVG, `lang="pt-BR"`.
- **Responsivo** (desktop e mobile) e com `prefers-reduced-motion`.
- Build de produção **passou** (`next build`) e verificado com screenshots.

### ⏳ Pendente (depende de acesso do cliente)
- **Deploy na Vercel**: o conector do Claude não tinha permissão para criar
  projeto (erro 403 / "You don't have permission to create a project"), e o nome
  `ferreira-veiculos-web` já existia na conta. Ver seção **7. Como colocar no ar**.
- **Supabase**: **não foi usado**. Optou-se por um arquivo único de estoque
  (`data/vehicles.ts`), que é mais simples, gratuito e suficiente para uma
  vitrine. Supabase pode ser adicionado depois, caso a loja queira um painel
  administrativo para editar o estoque sem mexer em código.
- **Estoque real**: os 12 veículos atuais são **demonstrativos**. Devem ser
  substituídos pelos carros reais (ver seção **6**).

---

## 4. Tecnologias usadas

| Camada        | Tecnologia                          |
|---------------|-------------------------------------|
| Framework     | Next.js 15 (App Router)             |
| Linguagem     | TypeScript                          |
| Estilo        | Tailwind CSS 4                      |
| Fontes        | Orbitron (títulos) + Inter (texto)  |
| Ícones/Logo   | SVG próprios (sem dependências)     |
| Vídeo         | ffmpeg (compressão para web)        |
| Hospedagem    | Vercel (recomendado)               |

---

## 5. Estrutura de pastas

```
Ferreira-Veiculos/
├── app/
│   ├── globals.css        Estilos globais, cores da marca, animações
│   ├── layout.tsx         Layout raiz, fontes, metadados/SEO
│   ├── page.tsx           Montagem da página (ordem das seções)
│   └── icon.svg           Favicon (logo em miniatura)
├── components/
│   ├── Header.tsx         Cabeçalho fixo + menu mobile
│   ├── Hero.tsx           Topo com vídeo de fundo e chamada
│   ├── BrandStrip.tsx     Faixa de marcas atendidas
│   ├── Catalog.tsx        Catálogo com busca/filtro/ordenação
│   ├── VehicleCard.tsx    Card de cada veículo
│   ├── CarArt.tsx         Arte (silhueta) quando não há foto
│   ├── WhyUs.tsx          Diferenciais da loja
│   ├── Reviews.tsx        Avaliações do Google
│   ├── Location.tsx       Contato + mapa
│   ├── Footer.tsx         Rodapé
│   ├── FloatingWhatsApp.tsx  Botão flutuante de WhatsApp
│   ├── Logo.tsx           Logo vetorial (cromado + dourado)
│   └── Icons.tsx          Todos os ícones SVG
├── data/
│   └── vehicles.ts        ⭐ ESTOQUE (edite aqui os carros)
├── lib/
│   └── config.ts          ⭐ DADOS DA LOJA (telefone, links, endereço)
├── public/
│   ├── media/
│   │   ├── hero.mp4        Vídeo do hero (comprimido)
│   │   └── hero-poster.jpg Imagem de capa do vídeo
│   └── cars/              Fotos dos veículos (adicione aqui)
├── README.md             Guia rápido
└── DOCUMENTACAO.md       Este documento
```

---

## 6. Como atualizar o site (para o dono da loja)

### 6.1. Editar o estoque de carros
Abra **`data/vehicles.ts`**. Cada carro é um bloco assim:

```ts
{
  id: "civic-exl-2020",          // identificador único (sem espaços)
  brand: "Honda",                 // marca (usada no filtro)
  model: "Civic EXL 2.0 CVT",     // modelo e versão
  year: "2020/2020",              // ano fab/modelo
  price: 124900,                  // preço em reais (só números)
  km: 68000,                      // quilometragem
  fuel: "Flex",                   // Flex | Gasolina | Diesel | Híbrido | Elétrico
  transmission: "CVT",            // Automático | Manual | CVT
  color: "Cinza",                 // cor
  body: "sedan",                  // sedan | hatch | suv | picape
  featured: true,                 // true = aparece em destaque
  badges: ["Único dono"],         // selos (opcional)
  // image: "/cars/civic.jpg",    // foto (opcional)
}
```

- **Adicionar carro:** copie um bloco, cole e edite.
- **Remover carro vendido:** apague o bloco dele.

### 6.2. Adicionar foto de um carro
1. Coloque a imagem em **`public/cars/`** (ex.: `public/cars/civic.jpg`).
2. No carro, descomente/preencha `image: "/cars/civic.jpg"`.
3. Sem foto, o site mostra uma silhueta elegante automaticamente.

### 6.3. Mudar telefone, endereço, links
Tudo em **`lib/config.ts`** (WhatsApp, telefone, Instagram, endereço, horário,
nota do Google, marcas). Editou lá → muda no site inteiro.

### 6.4. Trocar o vídeo do hero
Substitua **`public/media/hero.mp4`** mantendo o nome. Ideal: < 5 MB, sem áudio,
largura 1280px.

---

## 7. Como colocar no ar (deploy)

O código está pronto. Faltam **duas autorizações** que só o dono das contas pode
conceder (o assistente não tem login nas contas do cliente):

### Passo 1 — GitHub (dar permissão de escrita ao app Claude)
Sem isso, o `git push` retorna **403 (Resource not accessible by integration)**.
1. Acesse **github.com/settings/installations**
2. App **Claude** → **Configure**
3. Em **Repository permissions** → **Contents: Read and write**
4. Garanta que o repositório **Ferreira-Veiculos** está incluído → salvar/aprovar.

### Passo 2 — Vercel (publicar)
Depois do push, **a forma mais simples** (nem precisa do conector):
1. Acesse **vercel.com/new**
2. Importe o repositório **Djonathan-DA/Ferreira-Veiculos**
3. Clique em **Deploy** — em ~2 min o site sobe completo (com vídeo).
4. Cada novo push no GitHub publica a atualização automaticamente.

> Observação: o erro "Project ferreira-veiculos-web already exists" significa que
> já existe um projeto com esse nome na sua conta Vercel. Use outro nome
> (ex.: `ferreira-veiculos`) ou abra o projeto existente e conecte a este repo.

---

## 8. Rodar localmente (para desenvolvedor)

```bash
npm install       # instala dependências
npm run dev       # ambiente de desenvolvimento em http://localhost:3000
npm run build     # build de produção
npm start         # roda o build de produção
```

---

## 9. Histórico do projeto (linha do tempo)

1. **Briefing recebido** com vídeo do Civic, dados do Google e Instagram.
2. **Vídeo processado** com ffmpeg: 17 MB → 1,5 MB (720p, sem áudio) + poster.
3. **Projeto Next.js + Tailwind** criado e configurado.
4. **Identidade visual** recriada em SVG (logo cromada/dourada, paleta dark).
5. **Seções construídas**: Header, Hero (vídeo), Faixa de marcas, Catálogo,
   Diferenciais, Avaliações, Contato/Mapa, Rodapé, WhatsApp flutuante.
6. **Estoque demonstrativo** e dados da loja centralizados em arquivos editáveis.
7. **Build de produção validado** e verificado com screenshots (desktop + mobile).
8. **Commits realizados** na branch `claude/ferreira-veiculos-site-ki5y15`.
9. **Deploy pendente** apenas de autorização de acesso (GitHub/Vercel).

---

## 10. Decisões e observações

- **Supabase não foi necessário**: para uma vitrine, um arquivo de estoque é mais
  simples e sem custo. Fica como evolução futura (painel admin).
- **3ª avaliação do Google** ("comprei um carro nessa loja batido") **não foi
  incluída** por soar ambígua/negativa. Pode ser adicionada em `lib/config.ts`
  se o cliente quiser.
- **Estoque é demonstrativo** — precisa ser trocado pelos carros reais antes de
  divulgar o site.
- **Todos os CTAs** de compra levam ao WhatsApp oficial, conforme pedido.

---

*Documento gerado automaticamente como parte da entrega do projeto.*
