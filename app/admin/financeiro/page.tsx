"use client";

import { useMemo } from "react";
import { BRL, useAdmin } from "@/components/admin/shell";
import {
  BarChart,
  Card,
  CHART,
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

export default function FinanceiroPage() {
  const { vehicles } = useAdmin();

  const s = useMemo(() => {
    const sold = vehicles
      .filter((v) => v.status === "vendido")
      .sort((a, b) => (b.soldDate ?? "").localeCompare(a.soldDate ?? ""));
    const inStock = vehicles.filter((v) => v.status !== "vendido");
    const revenue = sold.reduce((t, v) => t + (v.soldPrice ?? v.price ?? 0), 0);
    const costSold = sold.reduce((t, v) => t + (v.cost ?? 0), 0);
    const costStock = inStock.reduce((t, v) => t + (v.cost ?? 0), 0);
    const priceStock = inStock.reduce((t, v) => t + (v.price ?? 0), 0);

    const byBrand = new Map<string, number>();
    const byModel = new Map<string, number>();
    for (const v of sold) {
      byBrand.set(v.brand, (byBrand.get(v.brand) ?? 0) + 1);
      const k = `${v.brand} ${v.model}`;
      byModel.set(k, (byModel.get(k) ?? 0) + 1);
    }
    const rank = (m: Map<string, number>) =>
      [...m.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([label, value]) => ({ label, value }));

    const now = new Date();
    const monthly: { key: string; label: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthly.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        label: MONTHS[d.getMonth()],
        value: 0,
      });
    }
    for (const v of sold) {
      const m = monthly.find((x) => (v.soldDate ?? "").startsWith(x.key));
      if (m) m.value += v.soldPrice ?? v.price ?? 0;
    }

    return {
      sold,
      revenue,
      costSold,
      profit: revenue - costSold,
      costStock,
      priceStock,
      ticket: sold.length ? Math.round(revenue / sold.length) : 0,
      byBrand: rank(byBrand),
      byModel: rank(byModel),
      monthly,
    };
  }, [vehicles]);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Financeiro</h1>
        <p className="text-sm text-white/40">
          Faturamento, custos, lucro e desempenho de vendas
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Kpi
          label="Total faturado"
          value={BRL(s.revenue)}
          accent="text-emerald-400"
        />
        <Kpi
          label="Custo dos vendidos"
          value={BRL(s.costSold)}
          accent="text-red-300"
        />
        <Kpi label="Lucro" value={BRL(s.profit)} accent="text-amber-300" />
        <Kpi
          label="Ticket médio"
          value={s.sold.length ? BRL(s.ticket) : "—"}
          hint="por venda"
        />
        <Kpi
          label="Capital em estoque"
          value={BRL(s.costStock)}
          hint="custo dos carros à venda"
        />
        <Kpi
          label="Potencial de venda"
          value={BRL(s.priceStock)}
          hint="preços anunciados"
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card
          title="Faturamento por mês"
          subtitle="Últimos 6 meses"
          className="lg:col-span-2"
        >
          {s.sold.length === 0 ? (
            <Empty>
              Nenhuma venda registrada ainda — os gráficos ganham vida na
              primeira venda.
            </Empty>
          ) : (
            <BarChart
              data={s.monthly}
              color={CHART.primary}
              format={(v) => BRL(v)}
              height={220}
            />
          )}
        </Card>

        <Card title="Marcas que mais vendem" subtitle="Histórico completo">
          {s.byBrand.length === 0 ? (
            <Empty>Sem vendas ainda.</Empty>
          ) : (
            <HBars
              data={s.byBrand}
              color={CHART.primary}
              format={(v) => `${v} ${v === 1 ? "venda" : "vendas"}`}
            />
          )}
        </Card>

        <Card title="Modelos que mais vendem" subtitle="Histórico completo">
          {s.byModel.length === 0 ? (
            <Empty>Sem vendas ainda.</Empty>
          ) : (
            <HBars
              data={s.byModel}
              color={CHART.vendido}
              format={(v) => `${v} ${v === 1 ? "venda" : "vendas"}`}
            />
          )}
        </Card>

        <Card
          title="Histórico de vendas"
          subtitle="Lucro real por veículo (venda − custo)"
          className="lg:col-span-2"
        >
          {s.sold.length === 0 ? (
            <Empty>Nenhuma venda ainda.</Empty>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="text-xs text-white/40 uppercase">
                  <tr>
                    <th className="pb-2">Veículo</th>
                    <th className="pb-2">Data</th>
                    <th className="pb-2 text-right">Custo</th>
                    <th className="pb-2 text-right">Venda</th>
                    <th className="pb-2 text-right">Lucro</th>
                  </tr>
                </thead>
                <tbody>
                  {s.sold.map((v) => {
                    const sale = v.soldPrice ?? v.price ?? 0;
                    const profit = sale - (v.cost ?? 0);
                    return (
                      <tr
                        key={v.id}
                        className="border-t border-white/5 transition hover:bg-white/[0.03]"
                      >
                        <td className="py-2.5">
                          {v.brand} {v.model} {v.year ?? ""}
                        </td>
                        <td className="py-2.5 text-white/60">
                          {v.soldDate
                            ? v.soldDate.split("-").reverse().join("/")
                            : "—"}
                        </td>
                        <td className="py-2.5 text-right text-white/60">
                          {BRL(v.cost)}
                        </td>
                        <td className="py-2.5 text-right">{BRL(sale)}</td>
                        <td
                          className={`py-2.5 text-right font-semibold ${
                            profit >= 0 ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {BRL(profit)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
