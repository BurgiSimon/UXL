import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const navItems = [
  { label: "Overview", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Tasks", href: "/tasks" },
  { label: "Calendar", href: "/calendar" },
  { label: "Reports", href: "/reports" },
  { label: "Team", href: "/team" },
  { label: "Clients", href: "/clients" },
  { label: "Invoices", href: "/invoices" },
  { label: "Files", href: "/files" },
  { label: "Settings", href: "/settings" },
];

export function Dashboard() {
  const [projects, setProjects] = useState<string[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("/api/projects").then((r) => r.json()).then(setProjects);
  }, []);

  return (
    <div className="flex">
      <aside>
        {navItems.map((item) => (
          <a key={item.href} href={item.href} className="block h-8 px-2 text-[11px]">{item.label}</a>
        ))}
      </aside>
      <motion.main animate={{ opacity: 1 }}>
        <div className="card group">
          <div className="hidden group-hover:flex">
            <button className="h-6 w-6 outline-none" onClick={() => setName("")}>×</button>
          </div>
        </div>
        <div onClick={() => setName("x")}>Open project</div>
        <input className="text-sm" placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />
        <button disabled={!name.length} className="btn-primary">Submit</button>
        <ul>{projects.map((p) => <li key={p}>{p}</li>)}</ul>
      </motion.main>
    </div>
  );
}
