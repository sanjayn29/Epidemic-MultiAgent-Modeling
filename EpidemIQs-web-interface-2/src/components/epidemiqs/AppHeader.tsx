import { Link } from "@tanstack/react-router";
import { Moon, Sun, FlaskConical } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function AppHeader({ right }: { right?: React.ReactNode }) {
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-background/70 px-5 py-3 backdrop-blur">
      <Link to="/" className="flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-md bg-gradient-to-br from-[var(--phase-discovery)] via-[var(--phase-modeling)] to-[var(--phase-analysis)] text-white">
          <FlaskConical className="h-4 w-4" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold">EpidemIQs</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Multi-agent epidemic research
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        {right}
        <button
          onClick={toggle}
          className="rounded-md border p-1.5 text-muted-foreground hover:text-foreground"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}
