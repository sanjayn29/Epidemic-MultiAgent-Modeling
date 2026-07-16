import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Bell, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 h-14 flex items-center gap-3 border-b border-border/60 bg-background/60 backdrop-blur px-3">
            <SidebarTrigger />
            <div className="flex-1 flex items-center gap-2 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search experiments, agents, reports…"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]/50 transition"
                />
              </div>
            </div>
            <button className="p-2 rounded-xl hover:bg-white/5 transition"><Bell className="h-4 w-4" /></button>
            <div className="h-8 w-8 rounded-full gradient-brand grid place-items-center text-white text-xs font-semibold">DR</div>
          </header>
          <main className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="p-4 md:p-8 max-w-[1400px] mx-auto"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
