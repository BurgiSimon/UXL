import { useQuery } from "@tanstack/react-query";
import { useReducedMotion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Projects", href: "/projects" },
  { label: "Tasks", href: "/tasks" },
  { label: "Reports", href: "/reports" },
  { label: "Settings", href: "/settings" },
];

export function ProjectList() {
  const reduceMotion = useReducedMotion();
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });

  if (isLoading) return <ProjectSkeleton />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!data?.length) return <EmptyState action={<Button>Create project</Button>} />;

  return (
    <section aria-labelledby="projects-heading">
      <nav aria-label="Workspace">
        {navItems.map((item) => (
          <a key={item.href} href={item.href} className="flex min-h-11 items-center px-3 text-base">{item.label}</a>
        ))}
      </nav>
      <h2 id="projects-heading">Projects</h2>
      <div className="grid gap-2">
        <Label htmlFor="search">Search projects</Label>
        <Input id="search" type="search" className="text-base md:text-sm" placeholder="e.g. Website redesign" />
      </div>
      <ul>{data.map((p) => <li key={p.id}><a href={`/projects/${p.id}`} className="block min-h-11">{p.name}</a></li>)}</ul>
      <button type="button" className="min-h-11 min-w-11 focus-visible:ring-2" aria-label="Close panel" data-motion={reduceMotion ? "off" : "on"}>×</button>
    </section>
  );
}

declare function fetchProjects(): Promise<{ id: string; name: string }[]>;
declare function ProjectSkeleton(): JSX.Element;
declare function ErrorState(props: { onRetry: () => void }): JSX.Element;
declare function EmptyState(props: { action: JSX.Element }): JSX.Element;
