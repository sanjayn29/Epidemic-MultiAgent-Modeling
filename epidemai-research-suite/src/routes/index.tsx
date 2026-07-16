import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Bot, LineChart, Network, FileText, Sparkles, Github, Twitter, Zap, Workflow, Microscope } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur bg-background/60 border-b border-border/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl gradient-brand grid place-items-center text-white font-bold">E</div>
            <span className="font-semibold tracking-tight">EpidemAI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#workflow" className="hover:text-foreground transition">Workflow</a>
            <a href="#agents" className="hover:text-foreground transition">Agents</a>
            <a href="#tech" className="hover:text-foreground transition">Technologies</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground px-3 py-2">Sign in</Link>
            <Link to="/dashboard" className="text-sm font-medium gradient-brand text-white rounded-xl px-4 py-2 glow-brand">
              Launch app
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full blur-3xl opacity-30 gradient-brand" />
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-[color:var(--brand-2)]" />
            Multi-agent AI for computational epidemiology
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-6xl md:text-8xl font-bold tracking-tight"
          >
            <span className="gradient-text">EpidemAI</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto"
          >
            Multi-Agent AI Platform for Epidemic Modeling, Simulation and Research.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex items-center justify-center gap-3 flex-wrap"
          >
            <Link to="/research" className="group inline-flex items-center gap-2 gradient-brand text-white rounded-2xl px-6 py-3 font-medium glow-brand">
              Start Research <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
            </Link>
            <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-medium hover:bg-white/10 transition">
              View Demo
            </Link>
          </motion.div>

          {/* preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 mx-auto max-w-5xl glass rounded-3xl p-2"
          >
            <div className="rounded-2xl bg-background/60 border border-white/5 p-6 text-left">
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { label: "Active Agents", value: "13" },
                  { label: "Simulations / hr", value: "142" },
                  { label: "Peak Infection", value: "4,200" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                    <p className="mt-1 text-2xl font-semibold gradient-text">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-40 rounded-xl bg-gradient-to-br from-[color:var(--brand)]/20 via-[color:var(--brand-2)]/10 to-[color:var(--success)]/10 border border-white/5 grid place-items-center text-muted-foreground text-sm">
                Live simulation preview
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <Section id="features" title="Features" kicker="What EpidemAI does">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Brain, title: "Autonomous Research", text: "Agents propose hypotheses, select models, and calibrate parameters end-to-end." },
            { icon: LineChart, title: "SIR / SEIR / SIS Models", text: "Configurable compartmental models with sensitivity analysis." },
            { icon: Network, title: "Contact Networks", text: "Random, scale-free, small-world and complete graphs for realistic spread." },
            { icon: Zap, title: "Real-time Simulation", text: "Watch epidemic curves evolve as agents iterate on parameters." },
            { icon: FileText, title: "Publication-Ready", text: "Auto-generated PDF, LaTeX and CSV outputs for every experiment." },
            { icon: Bot, title: "13 Specialised Agents", text: "Scientist and expert agents collaborate under a shared workspace." },
          ].map((f) => (
            <motion.div key={f.title} whileHover={{ y: -4 }} className="glass rounded-2xl p-6">
              <f.icon className="h-6 w-6 text-[color:var(--brand-2)]" />
              <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Workflow */}
      <Section id="workflow" title="Workflow" kicker="How a research run flows">
        <div className="grid md:grid-cols-5 gap-3">
          {["Discovery", "Modeling", "Simulation", "Analysis", "Report"].map((step, i) => (
            <motion.div
              key={step} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-5 text-center relative"
            >
              <div className="text-xs text-muted-foreground">Step {i + 1}</div>
              <div className="mt-2 font-semibold">{step}</div>
              <Workflow className="mt-3 h-5 w-5 mx-auto text-[color:var(--brand-2)]" />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Agents */}
      <Section id="agents" title="AI Agents" kicker="A crew of specialists">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-6">
            <h4 className="font-semibold">Scientist Agents</h4>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              {["Discovery", "Model", "Network", "Parameter", "Simulation", "Data"].map(a => (
                <li key={a} className="flex items-center gap-2"><Microscope className="h-4 w-4 text-[color:var(--brand)]" /> {a} Scientist</li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-2xl p-6">
            <h4 className="font-semibold">Expert Agents</h4>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              {["Online Retriever", "Literature Retriever", "Math Expert", "Vision Expert", "Data Expert", "Report Writer", "LaTeX Expert"].map(a => (
                <li key={a} className="flex items-center gap-2"><Bot className="h-4 w-4 text-[color:var(--brand-2)]" /> {a}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Tech */}
      <Section id="tech" title="Technologies" kicker="Built on solid foundations">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["React 19", "TypeScript", "Tailwind CSS", "Shadcn/UI", "TanStack Router", "Recharts", "Framer Motion", "Lucide Icons"].map(t => (
            <div key={t} className="glass rounded-xl px-4 py-3 text-center text-sm">{t}</div>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-border/60 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-6 w-6 rounded-lg gradient-brand grid place-items-center text-white text-xs font-bold">E</div>
            © 2026 EpidemAI — Research computing for outbreaks.
          </div>
          <div className="flex items-center gap-4 text-muted-foreground">
            <a href="#" className="hover:text-foreground"><Github className="h-4 w-4" /></a>
            <a href="#" className="hover:text-foreground"><Twitter className="h-4 w-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ id, title, kicker, children }: { id: string; title: string; kicker: string; children: React.ReactNode }) {
  return (
    <section id={id} className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-[color:var(--brand-2)]">{kicker}</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}
