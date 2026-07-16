import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Key } from "lucide-react";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [dark, setDark] = useState(true);
  const [notif, setNotif] = useState(true);
  const [lang, setLang] = useState("English");

  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark);
  }, [dark]);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your keys, preferences and notifications.</p>
      </div>

      <Section title="API Keys" icon={Key}>
        <ApiKey label="OpenAI" placeholder="sk-…" />
        <ApiKey label="Semantic Scholar" placeholder="ss-…" />
        <ApiKey label="Tavily" placeholder="tvly-…" />
      </Section>

      <Section title="Preferences">
        <Row label="Dark theme" hint="Toggle light / dark mode">
          <Switch checked={dark} onCheckedChange={setDark} />
        </Row>
        <Row label="Language">
          <Select value={lang} onValueChange={setLang}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {["English", "Français", "Deutsch", "日本語"].map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </Row>
        <Row label="Notifications" hint="Get notified when experiments finish">
          <Switch checked={notif} onCheckedChange={setNotif} />
        </Row>
      </Section>
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon?: any; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="h-4 w-4 text-[color:var(--brand-2)]" />}
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="divide-y divide-white/5">{children}</div>
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function ApiKey({ label, placeholder }: { label: string; placeholder: string }) {
  const [v, setV] = useState("");
  return (
    <div className="py-3 flex items-center justify-between gap-3 border-b border-white/5 last:border-0">
      <div className="min-w-32"><p className="text-sm font-medium">{label}</p></div>
      <input value={v} onChange={e => setV(e.target.value)} placeholder={placeholder}
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]/60" />
      <button onClick={() => toast.success(`${label} key saved`)}
        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">Save</button>
    </div>
  );
}
