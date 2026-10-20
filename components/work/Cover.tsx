import type { Project } from "@/content/projects";

/**
 * Title-block cover for projects without public screenshots: the project code set
 * large on blueprint paper. An identity plate, not a fake product capture.
 */
export default function Cover({ project, worldLabel, className = "" }: { project: Project; worldLabel: string; className?: string }) {
  return (
    <div className={`@container blueprint flex flex-col justify-between overflow-hidden bg-paper-2 p-5 ${className}`} aria-hidden="true">
      <div className="flex justify-between font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-mute">
        <span>{worldLabel}</span>
        <span>{project.stack[0]}</span>
      </div>
      <p className="display text-[clamp(2.25rem,23cqw,8rem)] leading-[0.8] text-ink transition-colors duration-500 group-hover:text-signal">
        {project.code}
      </p>
    </div>
  );
}
