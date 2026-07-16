import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Signed in (demo)");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex relative overflow-hidden">
        <div className="absolute inset-0 gradient-brand opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="relative z-10 p-12 flex flex-col justify-between text-white">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-white/15 backdrop-blur grid place-items-center font-bold">E</div>
            <span className="font-semibold">EpidemAI</span>
          </Link>
          <div>
            <h2 className="text-3xl font-semibold leading-tight">Simulate outbreaks with a research crew of AI agents.</h2>
            <p className="mt-3 text-white/80 max-w-md">Sign in to launch multi-agent epidemic experiments in seconds.</p>
          </div>
          <p className="text-xs text-white/60">© 2026 EpidemAI</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your EpidemAI account</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[color:var(--brand)]/60" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[color:var(--brand)]/60" />
            </div>
            <button type="submit" className="w-full gradient-brand text-white rounded-xl py-2.5 font-medium glow-brand">Login</button>
          </form>
          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-white/10" /> or <div className="flex-1 h-px bg-white/10" />
          </div>
          <button onClick={() => { toast.success("Signed in with Google (demo)"); navigate({ to: "/dashboard" }); }}
            className="w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 py-2.5 text-sm font-medium">
            Continue with Google
          </button>
          <p className="mt-6 text-xs text-muted-foreground text-center">
            Don't have an account? <Link to="/dashboard" className="text-[color:var(--brand-2)]">Explore demo</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
