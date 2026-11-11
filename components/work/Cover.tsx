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
      {/* Long codes (MCODE) shrink so the plate never clips them */}
      <p
        className="display leading-[0.8] text-ink transition-colors duration-500 group-hover:text-signal"
        style={{ fontSize: `clamp(2.25rem, min(23cqw, ${(82 / (project.code.length * 0.9)).toFixed(1)}cqw), 8rem)` }}
      >
        {project.code}
      </p>
    </div>
  );
}
