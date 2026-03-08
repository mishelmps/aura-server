import { cn } from "@/lib/utils";

interface FilterPillsProps {
  options: { label: string; value: string; count?: number }[];
  selected: string;
  onSelect: (value: string) => void;
}

export function FilterPills({ options, selected, onSelect }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={cn(
            "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
            selected === opt.value
              ? "bg-primary text-primary-foreground"
              : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          {opt.label}
          {opt.count !== undefined && (
            <span className="ml-1.5 text-xs opacity-70">{opt.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
