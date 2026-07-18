/**
 * Logo oficial Ferreira Veículos (imagem fornecida pela loja, fundo transparente).
 * variant "inline"  → altura reduzida, para header/footer.
 * variant "stacked" → tamanho grande, para o hero.
 */

export function Logo({
  variant = "stacked",
  className = "",
  prefix: _prefix,
}: {
  variant?: "stacked" | "inline";
  className?: string;
  prefix?: string;
}) {
  const sizing =
    variant === "inline"
      ? "h-10 md:h-12 w-auto"
      : "w-[min(520px,82vw)] h-auto";
  return (
    <img
      src="/media/logo.png"
      alt="Ferreira Veículos"
      className={`${sizing} ${className}`}
      draggable={false}
    />
  );
}
