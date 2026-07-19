"use client";

import { useMemo } from "react";
import Link from "next/link";
import { BRL, useAdmin } from "@/components/admin/shell";
import {
  BarChart,
  Card,
  CHART,
  Donut,
  Empty,
  HBars,
  Kpi,
} from "@/components/admin/charts";

const MONTHS = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

export default function AdminHome() {
  const { vehicles } = useAdmin();

  const s = useMemo(() => {
    const sold = vehicles.filter((v) => v.status === "vendido");
    const inStock = vehicles.filter((v) => v.status !== "vendido");
    const revenue = sold.reduce((t, v) => t + (v.soldPrice ?? v.price ?? 0), 0);
    const costSold = sold.reduce((t, v) => t + (v.cost ?? 0), 0);

    const byBrand = new Map<string, number>();
    for (const v of inStock)
      byBrand.set(v.brand, (byBrand.get(v.brand) ?? 0) + 1);

    const soldByModel = new Map<string, number>();
    for (const v of sold) {
      const k = `${v.brand} ${v.model}`;
      soldByModel.set(k, (soldByModel.get(k) ?? 0) + 1);
    }

    // vendas dos últimos 6 meses
    const now = new Date();
    const months: { key: string; label: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        label: MONTHS[d.getMonth()],
        value: 0,
      });
    }
    for (const v of sold) {
      const m = months.find((x) => (v.soldDate ?? "").startsWith(x.key));
      if (m) m.value += v.soldPrice ?? v.price ?? 0;
    }

    return {
      sold,
      revenue,
      profit: revenue - costSold,
      available: inStock.filter(
        (v) => (v.status ?? "disponivel") === "disponivel",
      ).length,
      negotiating: inStock.filter((v) => v.status === "negociacao").length,
      byBrand: [...byBrand.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([label, value]) => ({ label, value })),
      topModels: [...soldByModel.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([label, value]) => ({ label, value })),
      monthly: months,
    };
  }, [vehicles]);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Visão geral</h1>
          <p className="text-sm text-white/40">
            Resumo do estoque e das vendas da loja
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/estoque"
            className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-black hover:bg-amber-300"
          >
            Gerenciar estoque
          </Link>
          <Link
            href="/admin/financeiro"
            className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold hover:bg-white/10"
          >
            Ver financeiro
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          label="Total faturado"
          value={BRL(s.revenue)}
          accent="text-emerald-400"
          hint={`${s.sold.length} ${s.sold.length === 1 ? "venda" : "vendas"}`}
        />
        <Kpi
          label="Lucro"
          value={BRL(s.profit)}
          accent="text-amber-300"
          hint="vendas − custos"
        />
        <Kpi
          label="Disponíveis"
          value={String(s.available)}
          hint="anunciados no site"
        />
        <Kpi
          label="Em negociação"
          value={String(s.negotiating)}
          accent="text-orange-300"
        />
      </div>

      {/* gráficos */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card
          title="Faturamento por mês"
          subtitle="Vendas registradas nos últimos 6 meses"
        >
          {s.sold.length === 0 ? (
            <Empty>
              Nenhuma venda registrada ainda.
              <br />
              Marque um carro como “Vendido” no Estoque.
            </Empty>
          ) : (
            <BarChart
              data={s.monthly}
              color={CHART.primary}
              format={(v) => BRL(v)}
            />
          )}
        </Card>

        <Card
          title="Situação do estoque"
          subtitle="Todos os veículos cadastrados"
        >
          <Donut
            centerLabel="veículos"
            segments={[
              {
                label: "Disponível",
                value: s.available,
                color: CHART.disponivel,
              },
              {
                label: "Em negociação",
                value: s.negotiating,
                color: CHART.negociacao,
              },
              { label: "Vendido", value: s.sold.length, color: CHART.vendido },
            ]}
          />
        </Card>

        <Card
          title="Estoque por marca"
          subtitle="Veículos à venda ou em negociação"
        >
          {s.byBrand.length === 0 ? (
            <Empty>Nenhum veículo em estoque.</Empty>
          ) : (
            <BarChart data={s.byBrand} color={CHART.primary} />
          )}
        </Card>

        <Card title="Modelos mais vendidos" subtitle="Top 5 do histórico">
          {s.topModels.length === 0 ? (
            <Empty>
              O ranking aparece aqui após a primeira venda registrada.
            </Empty>
          ) : (
            <HBars
              data={s.topModels}
              color={CHART.vendido}
              format={(v) => `${v} ${v === 1 ? "venda" : "vendas"}`}
            />
          )}
        </Card>
      </div>
    </>
  );
}
