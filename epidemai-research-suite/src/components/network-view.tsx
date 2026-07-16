import { useMemo, useRef, useState, useEffect } from "react";
import { networkStats } from "@/lib/mock-data";
import { motion } from "framer-motion";

type Node = { id: number; x: number; y: number; group: number; r: number };
type Edge = { a: number; b: number };

function generate(n = 120) {
  const nodes: Node[] = Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 800 + 100,
    y: Math.random() * 500 + 50,
    group: Math.floor(Math.random() * 6),
    r: 3 + Math.random() * 4,
  }));
  const edges: Edge[] = [];
  for (let i = 0; i < n; i++) {
    const k = 2 + Math.floor(Math.random() * 3);
    for (let j = 0; j < k; j++) {
      const b = Math.floor(Math.random() * n);
      if (b !== i) edges.push({ a: i, b });
    }
  }
  return { nodes, edges };
}

const groupColors = ["#4F46E5", "#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6"];

export function NetworkView() {
  const { nodes, edges } = useMemo(() => generate(), []);
  const [hover, setHover] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragging = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const up = () => (dragging.current = null);
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  const highlighted = new Set<number>();
  if (hover !== null) {
    highlighted.add(hover);
    edges.forEach(e => {
      if (e.a === hover) highlighted.add(e.b);
      if (e.b === hover) highlighted.add(e.a);
    });
  }

  return (
    <div className="grid lg:grid-cols-[1fr_240px] gap-4">
      <div className="relative rounded-xl bg-background/40 border border-white/5 overflow-hidden">
        <svg
          viewBox="0 0 1000 600"
          className="w-full h-[520px] cursor-grab active:cursor-grabbing"
          onWheel={(e) => { e.preventDefault(); setZoom(z => Math.min(3, Math.max(0.5, z - e.deltaY * 0.001))); }}
          onMouseDown={(e) => (dragging.current = { x: e.clientX - pan.x, y: e.clientY - pan.y })}
          onMouseMove={(e) => { if (dragging.current) setPan({ x: e.clientX - dragging.current.x, y: e.clientY - dragging.current.y }); }}
        >
          <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
            {edges.map((e, i) => {
              const a = nodes[e.a], b = nodes[e.b];
              const active = hover !== null && (e.a === hover || e.b === hover);
              return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={active ? "#3B82F6" : "rgba(255,255,255,0.08)"}
                strokeWidth={active ? 1.2 : 0.6} />;
            })}
            {nodes.map(n => {
              const active = highlighted.has(n.id) || hover === null;
              return (
                <circle key={n.id} cx={n.x} cy={n.y} r={n.r}
                  fill={groupColors[n.group]}
                  opacity={active ? 1 : 0.15}
                  onMouseEnter={() => setHover(n.id)}
                  onMouseLeave={() => setHover(null)}
                  style={{ cursor: "pointer", transition: "opacity 0.2s" }} />
              );
            })}
          </g>
        </svg>
        <div className="absolute top-3 right-3 flex flex-col gap-1">
          <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="glass rounded-lg h-8 w-8 text-sm">+</button>
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="glass rounded-lg h-8 w-8 text-sm">−</button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="glass rounded-lg h-8 w-8 text-[10px]">1:1</button>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Network Statistics</h4>
        {Object.entries({
          Nodes: networkStats.nodes,
          Edges: networkStats.edges,
          "Average Degree": networkStats.averageDegree,
          Density: networkStats.density,
          Communities: networkStats.communities,
        }).map(([k, v]) => (
          <motion.div key={k} whileHover={{ x: 2 }} className="rounded-xl bg-white/5 border border-white/5 p-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{k}</span>
            <span className="text-sm font-medium">{v}</span>
          </motion.div>
        ))}
        <div className="rounded-xl bg-white/5 border border-white/5 p-3">
          <p className="text-xs text-muted-foreground mb-2">Communities</p>
          <div className="flex flex-wrap gap-1.5">
            {groupColors.map((c, i) => (
              <div key={i} className="h-4 w-4 rounded" style={{ background: c }} title={`Community ${i + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
