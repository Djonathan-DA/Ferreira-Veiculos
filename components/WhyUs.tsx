import {
  CarKeyIcon,
  CoinsIcon,
  HandshakeIcon,
  ShieldIcon,
} from "./Icons";

const items = [
  {
    icon: ShieldIcon,
    title: "Procedência garantida",
    text: "Veículos vistoriados e com documentação verificada antes de entrar no estoque.",
  },
  {
    icon: CoinsIcon,
    title: "Financiamento facilitado",
    text: "Trabalhamos com os principais bancos para encontrar a melhor parcela para você.",
  },
  {
    icon: HandshakeIcon,
    title: "Seu usado na troca",
    text: "Avaliamos o seu carro atual e usamos como entrada na negociação.",
  },
  {
    icon: CarKeyIcon,
    title: "Negociação rápida",
    text: "Atendimento direto no WhatsApp, sem burocracia — do primeiro contato à entrega da chave.",
  },
];

export function WhyUs() {
  return (
    <section id="a-loja" className="relative bg-night-800/50 py-20 sm:py-24">
      <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          <span className="text-[11px] font-bold tracking-[0.35em] text-gold-500 uppercase">
            A Loja
          </span>
          <h2 className="font-display mt-3 text-3xl font-bold text-white sm:text-4xl">
            Por que comprar na{" "}
            <span className="text-gold-metal">Ferreira Veículos</span>?
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-white/60 sm:text-base">
            Somos referência em seminovos em Águas Lindas de Goiás: atendimento
            diferenciado, ótimas oportunidades e condições que cabem no seu bolso.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.title}
              className="card-lift rounded-2xl border border-white/10 bg-night-700 p-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500/12 text-gold-400">
                <item.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-base font-bold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
