# Ferreira Veículos — Site oficial

Site institucional e catálogo de veículos da **Ferreira Veículos** (Águas Lindas
de Goiás – GO), construído com Next.js 15 + Tailwind CSS 4 e hospedado na Vercel.

## ✏️ Como atualizar o estoque (o mais importante!)

Todo o estoque fica em **um único arquivo**: [`data/vehicles.ts`](data/vehicles.ts).

1. Abra `data/vehicles.ts`
2. Copie um bloco de veículo existente e edite: marca, modelo, ano, km, preço…
3. Para remover um carro vendido, apague o bloco dele
4. Salve — ao fazer push, a Vercel publica automaticamente

> ⚠️ O estoque atual é de **demonstração**. Substitua pelos veículos reais da loja.

### Fotos dos carros

1. Coloque a foto em `public/cars/` (ex.: `public/cars/civic.jpg`)
2. No veículo correspondente, preencha `image: "/cars/civic.jpg"`
3. Enquanto não houver foto, o site mostra uma arte elegante com a silhueta do carro

## 📞 Dados da loja

Telefone, WhatsApp, endereço, horário, Instagram e avaliações ficam em
[`lib/config.ts`](lib/config.ts) — basta editar lá que o site inteiro atualiza.

- Todos os botões de compra apontam para o WhatsApp oficial:
  `https://wa.me/message/S4Y6SXEYINUAM1`

## 🎬 Vídeo do hero

O vídeo de fundo fica em `public/media/hero.mp4` (comprimido para ~1,5 MB).
Para trocar, substitua o arquivo mantendo o mesmo nome — ideal manter abaixo de
5 MB, sem áudio, resolução 1280px.

## 🛠 Desenvolvimento local

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # build de produção
```

## 🚀 Deploy

O site está na **Vercel**. Qualquer push na branch principal do repositório
conectado publica uma nova versão automaticamente.

## 📂 Estrutura

```
app/            páginas, layout, estilos globais e favicon
components/     seções do site (Hero, Catálogo, Avaliações, …)
data/           vehicles.ts — ESTOQUE (edite aqui)
lib/            config.ts — dados da loja (telefone, endereço, links)
public/media/   vídeo e imagem do hero
public/cars/    fotos dos veículos (adicione aqui)
```
